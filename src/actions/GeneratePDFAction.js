import { jsPDF } from "jspdf";
import { DocumentIcon } from "@sanity/icons";

const flattenJSON = (obj = {}, res = {}, extraKey = "") => {
    Object.entries(obj).forEach((entry) => {
      if (typeof entry[1] !== "object") res[extraKey + entry[0]] = entry[1];
      else flattenJSON(entry[1], res, `${extraKey}${entry[0]}.`);
    });

    return res;
  },
  parser = (data, text) => {
    if (data.title) text += "\n" + data.title.toUpperCase() + "\n\n\n";
    Object.entries(flattenJSON(data)).forEach((entry) => {
      if (
        entry[0] !== "title" &&
        entry[0].indexOf("_") !== 0 &&
        entry[0].indexOf("._") === -1 &&
        typeof entry[1] === "string" &&
        entry[1].length > 0
      )
        text += entry[1] + "\n\n";
    });

    return text;
  };

export const GeneratePDFAction = (props) => {
  if (props.published === null) return;

  const { published } = props,
    pageWidth = 8.3,
    lineHeight = 1.15,
    margin = 0.5,
    maxLineWidth = pageWidth - margin * 2,
    fontSize = 14,
    ptsPerInch = 72,
    oneLineHeight = (fontSize * lineHeight) / ptsPerInch,
    doc = new jsPDF({ unit: "in", lineHeight }),
    text = parser(published, ""),
    maxLines = parseInt((11.7 - margin * 2) / oneLineHeight);
  let textLines = doc
    .setFont("helvetica")
    .setFontSize(fontSize)
    .splitTextToSize(text.replace(/\u2028/g, ""), maxLineWidth);

  if (textLines.length === 0)
    textLines = [
      "It looks like you haven't got any text fields in your schema! PDF generator will render the content of any fields containg text in ascending order based on field name. If a field named 'title' is present, its value will be rendered first.",
    ];
  textLines = textLines.filter((line) => line.slice(0, 1) !== "@");
  for (let i = 0; i < textLines.length / maxLines; i++) {
    if (i > 0) doc.addPage("a4");
    for (let j = 0; j < maxLines; j++) {
      if (textLines[i * maxLines + j]) {
        doc.text(
          textLines[i * maxLines + j],
          margin,
          margin + j * oneLineHeight
        );
      }
    }
  }

  return {
    label: "Generate PDF",
    icon: DocumentIcon,
    onHandle: () => doc.save(`${published._id}.pdf`),
  };
};
