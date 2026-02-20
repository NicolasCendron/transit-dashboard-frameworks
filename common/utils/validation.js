export function validateTripForm(form, t) {
    const errors = {};
    const required = ["origin", "destination", "departureTime", "driver"];
    for (const field of required) {
        if (!form[field].trim())
            errors[field] = t("form.required");
    }
    if (form.status === "arrived" && !form['arrivalTime']) {
        errors['arrivalTime'] = t("form.arrivalRequiredWhenArrived");
    }
    if (form.departureTime && form['arrivalTime']) {
        const depTime = new Date(form.departureTime).getTime();
        const arrTime = new Date(form['arrivalTime']).getTime();
        if (!isNaN(depTime) && !isNaN(arrTime) && arrTime <= depTime) {
            errors['arrivalTime'] = t("form.arrivalMustBeAfterDeparture");
        }
    }
    return errors;
}
