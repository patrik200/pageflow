import React from "react";

import Header from "components/Header";
import Footer from "components/Footer";
import Spacing from "components/Spacing";

import { bodyWrapperStyles, wrapperStyles } from "templates/coreStyles.css";

import Wrapper from "../../../../__Wrapper";
import RevisionInfo from "./RevisionInfo";
import CommentInfo from "./CommentInfo";

interface DocumentRevisionCommentApprovedInterface {
  frontendHost: string;
  id: string;
  revisionName: string;
  revisionId: string;
  authorName: string;
  approvedAt: string;
}

function DocumentRevisionCommentApproved({
  frontendHost,
  revisionName,
  revisionId,
  authorName,
  approvedAt,
}: DocumentRevisionCommentApprovedInterface) {
  const link = `${frontendHost}/document-revisions/${revisionId}`;

  return (
    <Wrapper maxWidth="768px" frontendHost={frontendHost}>
      <div className={wrapperStyles}>
        <Header />
        <div className={bodyWrapperStyles}>
          <CommentInfo authorName={authorName} approvedAt={approvedAt} />
          <Spacing />
          <RevisionInfo name={revisionName} link={link} />
        </div>
        <Footer />
      </div>
    </Wrapper>
  );
}

export default React.memo(DocumentRevisionCommentApproved);
