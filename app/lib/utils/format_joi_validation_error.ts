export const formatValidationError = ({
  details,
}: {
  details: any[];
}): string[] => {
  return details.map((detail) => {
    if (detail.message) {
      return detail.message.split('"').join('');
    }
    return detail.message;
  });
};
