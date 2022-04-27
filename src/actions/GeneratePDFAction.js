import { jsPDF } from "jspdf";
import { DocumentIcon } from "@sanity/icons";

const flattenJSON = (obj = {}, res = {}, extraKey = "") => {
    for (key in obj) {
      if (typeof obj[key] !== "object") res[extraKey + key] = obj[key];
      else flattenJSON(obj[key], res, `${extraKey}${key}.`);
    }

    return res;
  },
  parser = (data, text) => {
    Object.entries(flattenJSON(data)).forEach((entry) => {
      if (
        entry[0].indexOf("_") !== 0 &&
        entry[0].indexOf("._") === -1 &&
        typeof entry[1] === "string" &&
        entry[1].indexOf(" ") !== -1 &&
        entry[1].length > 1
      )
        text +=
          "%gray%" +
          entry[0].replace(/\./g, " > ") +
          ":\n\n" +
          entry[1] +
          "\n\n";
    });

    return text;
  };

export const GeneratePDFAction = (props) => {
  const { published } = props,
    pageWidth = 8.3,
    lineHeight = 1.15,
    margin = 0.5,
    maxLineWidth = pageWidth - margin * 2,
    fontSize = 14,
    ptsPerInch = 72,
    oneLineHeight = (fontSize * lineHeight) / ptsPerInch,
    doc = new jsPDF({ unit: "in", lineHeight }),
    text = parser(_data, ""),
    textLines = doc
      .setFont("helvetica")
      .setFontSize(fontSize)
      .splitTextToSize(text, maxLineWidth),
    maxLines = parseInt((11.7 - margin * 2) / oneLineHeight);

  for (let i = 0; i < textLines.length / maxLines; i++) {
    if (i > 0) doc.addPage("a4");
    for (let j = 0; j < maxLines; j++) {
      if (textLines[i * maxLines + j]) {
        if (textLines[i * maxLines + j].indexOf("%gray%") === 0)
          doc.setTextColor(150);
        else doc.setTextColor(0);
        doc.text(
          textLines[i * maxLines + j].indexOf("%gray%") === 0
            ? textLines[i * maxLines + j]
                .replace("%gray%", "")
                .toUpperCase()
                .replace(/\_/g, " ")
            : textLines[i * maxLines + j],
          margin,
          margin + j * oneLineHeight
        );
      }
    }
  }

  return {
    label: "Generate PDF",
    icon: DocumentIcon,
    onHandle: () => doc.save(`${published.title || published._id}.pdf`),
  };
};
