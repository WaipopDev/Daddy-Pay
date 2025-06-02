const validateRequiredFields = (fields: { value: string, label: string }[]): string | null => {
    const errors = fields
        .filter(field => field.value === '')
        .map(field => `- ${field.label}`);

    return errors.length > 0
        ? errors.join('<br/>')
        : null;
}

export default validateRequiredFields;