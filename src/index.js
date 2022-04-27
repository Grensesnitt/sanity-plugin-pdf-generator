import defaultResolve from "part:@sanity/base/document-actions";

import { GeneratePDFAction } from "./actions/GeneratePDFAction";

const resolveDocumentActions = (props) => {
  return [...defaultResolve(props), () => GeneratePDFAction(props)];
};

export default resolveDocumentActions;
