export const extractPolicyCertificateUrl = (responseData: any) => {
  const candidateUrl =
    responseData?.certificateUrl ||
    responseData?.policy?.certificateUrl ||
    responseData?.policy?.certificate ||
    responseData?.policyData?.certificateUrl ||
    responseData?.policyData?.certificate;

  if (!candidateUrl || candidateUrl === "none") {
    return null;
  }

  return candidateUrl;
};

export const extractPolicyCertificateFileName = (responseData: any) => {
  const policyNumber =
    responseData?.policy?.policyNumber ||
    responseData?.policyData?.policyNumber ||
    responseData?.policyNumber;

  if (!policyNumber) {
    return "Insurance-Certificate.pdf";
  }

  return `${String(policyNumber).replace(/[^\w-]+/g, "_")}-certificate.pdf`;
};
