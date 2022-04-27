import { jsPDF } from "jspdf";
import { DocumentIcon } from "@sanity/icons";

export const GeneratePDFAction = (props) => {
  const { published } = props;

  return {
    label: "Generate PDF",
    icon: DocumentIcon,
    onHandle: () => {
      new jsPDF()
        .text(JSON.stringify(published), 10, 10)
        .save(`${published._id}.pdf`);
    },
  };
};
