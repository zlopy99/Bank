import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { SaveClientDataDto } from "../dto/dto-interfaces";
import { exportCountry } from '../../components/clients-detail/clients-detail.component';
import { countryExportFromDialog } from '../../dialogs/open-new-client-detail-dialog/open-new-client-detail-dialog.component';

export function isValueDefined(value: any): boolean {
    if (value !== undefined && value !== '' && value !== null)
        return true;
    return false;
}

export function checkIfValueIsGoodForEditClient(originalValues: SaveClientDataDto | undefined, formControlData: FormGroup): boolean {
    if (!(originalValues?.name == formControlData.get('name')?.getRawValue())) return true;
    if (!(originalValues?.lastName == formControlData.get('lastName')?.getRawValue())) return true;
    if (!(originalValues?.dateOfBirth == formControlData.get('dateOfBirth')?.getRawValue())) return true;
    if (!(originalValues?.jmbg == formControlData.get('jmbg')?.getRawValue())) return true;
    if (!(originalValues?.sex == formControlData.get('sex')?.getRawValue())) return true;
    if (!(originalValues?.personalDocNumber == formControlData.get('personalDocNumber')?.getRawValue())) return true;
    if (!(originalValues?.parentName == formControlData.get('parentName')?.getRawValue())) return true;
    if (!(originalValues?.streetName == formControlData.get('streetName')?.getRawValue())) return true;
    if (!(originalValues?.streetNumber == formControlData.get('streetNumber')?.getRawValue())) return true;
    if (!(originalValues?.city == formControlData.get('city')?.getRawValue())) return true;
    if (!(originalValues?.countryId == formControlData.get('country')?.getRawValue()?.id)) return true;
    if (!(originalValues?.pttNumber == formControlData.get('pttNumber')?.getRawValue())) return true;
    if (!(originalValues?.phoneNumber == formControlData.get('phoneNumber')?.getRawValue())) return true;
    if (!(originalValues?.mobileNumber == formControlData.get('mobileNumber')?.getRawValue())) return true;
    if (!(originalValues?.email == formControlData.get('email')?.getRawValue())) return true;

    return false;
}

export function countryValidator(control: AbstractControl): Promise<ValidationErrors | null> {

    return new Promise((resolve) => {
        setTimeout(() => {
            if (typeof control.value === 'string') {
                resolve({ needsToBePickedFromTheList: true });
            } else {
                resolve(null);
            }
        }, 500);
    });
}

export function cityValidator(control: AbstractControl): Promise<ValidationErrors | null> {

    return new Promise((resolve) => {
        setTimeout(() => {
            if (exportCountry === 22) {
                if (typeof control.value === 'string') {
                    resolve({ needsToBePickedFromTheList: true });
                } else {
                    resolve(null);
                }
            } else resolve(null);
        }, 500);
    });
}

export function cityValidatorForOpening(control: AbstractControl): Promise<ValidationErrors | null> {

    return new Promise((resolve) => {
        setTimeout(() => {
            if (countryExportFromDialog === 22) {
                if (typeof control.value === 'string') {
                    resolve({ needsToBePickedFromTheList: true });
                } else {
                    resolve(null);
                }
            } else resolve(null);
        }, 500);
    });
}