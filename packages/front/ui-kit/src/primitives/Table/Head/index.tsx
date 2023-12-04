import React from "react";

export interface TableHeadInterface {
  className?: string;
  children: React.ReactNode;
}

function TableHead({ className, children }: TableHeadInterface) {
  return <thead className={className}>{children}</thead>;
}

export default React.memo(TableHead);
