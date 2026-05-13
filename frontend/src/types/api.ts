export type ApiValidationIssue = {
  path: string;
  message: string;
};

export type ApiErrorResponse = {
  message: string;
  errors?: ApiValidationIssue[];
};
