import React from "react";

import Header from "components/Header";
import Footer from "components/Footer";
import Spacing from "components/Spacing";

import { bodyWrapperStyles, wrapperStyles } from "templates/coreStyles.css";

import Wrapper from "../../../../__Wrapper";
import RevisionInfo from "./RevisionInfo";
import CommentInfo from "./CommentInfo";

interface DocumentRevisionCommentCreatedInterface {
  frontendHost: string;
  revisionNumber: string;
  revisionId: string;
  authorName: string;
  createdAt: string;
  id: string;
}

function DocumentRevisionCommentCreated({
  frontendHost,
  revisionNumber,
  revisionId,
  authorName,
  createdAt,
}: DocumentRevisionCommentCreatedInterface) {
  const link = `${frontendHost}/document-revisions/${revisionId}`;
  return (
    <Wrapper maxWidth="768px" frontendHost={frontendHost}>
      <div className={wrapperStyles}>
        <Header />
        <div className={bodyWrapperStyles}>
          <CommentInfo authorName={authorName} createdAt={createdAt} />
          <Spacing />
          <RevisionInfo number={revisionNumber} link={link} />
        </div>
        <Footer />
      </div>
    </Wrapper>
  );
}

export default React.memo(DocumentRevisionCommentCreated);
