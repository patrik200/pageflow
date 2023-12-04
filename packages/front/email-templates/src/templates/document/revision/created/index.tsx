import React from "react";

import Header from "components/Header";
import Footer from "components/Footer";
import Spacing from "components/Spacing";

import { bodyWrapperStyles, wrapperStyles } from "templates/coreStyles.css";

import Wrapper from "../../../__Wrapper";
import RevisionInfo from "./RevisionInfo";
import DocumentInfo from "./DocumentInfo";

interface DocumentRevisionCreatedInterface {
  frontendHost: string;
  documentName: string;
  number: string;
  id: string;
  authorName: string;
  createdAt: string;
  responsibleUserName: string | null;
  responsibleUserFlowName: string | null;
}

function DocumentRevisionCreated({
  frontendHost,
  documentName,
  number,
  id,
  authorName,
  createdAt,
  responsibleUserName,
  responsibleUserFlowName,
}: DocumentRevisionCreatedInterface) {
  const revisionLink = `${frontendHost}/document-revisions/${id}`;

  return (
    <Wrapper maxWidth="768px" frontendHost={frontendHost}>
      <div className={wrapperStyles}>
        <Header />
        <div className={bodyWrapperStyles}>
          <RevisionInfo
            number={number}
            link={revisionLink}
            authorName={authorName}
            createdAt={createdAt}
            responsibleUserName={responsibleUserName}
            responsibleUserFlowName={responsibleUserFlowName}
          />
          <Spacing />
          <DocumentInfo name={documentName} />
        </div>
        <Footer />
      </div>
    </Wrapper>
  );
}

export default React.memo(DocumentRevisionCreated);
