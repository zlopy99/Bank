
export interface AccountDto {
    id?: number;
    name?: string;
    openingDate?: string;
    closingDate?: string;
}

export interface AccountClientTypeDetailDto {
    id?: number;
    name?: string;
    openingDate?: string;
    closingDate?: string;
    accountTypeId?: number;
    accountTypeName?: string;
    accountDetailId?: number;
    accountDetailCurrencyAmount?: number;
    accountDetailCurrencyName?: string;
    clientId?: number;
    clientName?: string;
    clientLastName?: string;
    clientDateOfBirth?: number;
    clientJmbg?: string;
    clientSex?: string;
    clientPersonalDocId?: string;   
    clientOpeningDate?: string;
    clientClosingDate?: string;
}

export interface AccountTypeDto {
    id?: number;
    name?: string;
    percentage?: number;
}

export interface CountryDto {
    id?: number;
    name?: string;
}

export interface CityDto {
    id?: number;
    name?: string;
}

export interface AccountDetailDto {
    id?: number;
    currencyAmount?: number;
    currency?: string;
}

export interface ClientDto {
    id?: number;
    name?: string;
    openingDate?: string;
    closingDate?: string;
    lastName?: string;
    dateOfBirth?: string;
    jmbg?: string;
    sex?: string;
    personalDocId?: string;
}

export interface ClientAccountDto {
    clientDto?: ClientDto[];
    accountDto?: AccountDto[];
}

export interface ResponseDto {
    object: any;
    clientId: number;
    errorMessage: string;
}

export interface SaveClientDataDto {
    dateOfBirth: string,
    jmbg: string,
    lastName: string,
    name: string,
    sex: string,
    personalDocNumber: string,
    city?: string,
    cityId?: number,
    countryId?: number,
    country?: string,
    email: string,
    mobileNumber: number,
    parentName: string,
    phoneNumber: number,
    pttNumber: number,
    streetName: string,
    streetNumber: number,
    status?: string
}

export interface OpenAccountDto {
    name: string,
    accountTypeId: number,
    accountDetailCurrencyAmmount: number,
    accountDetailCurrencyId: number,
    clientId: number
}

export interface ClientsInLastWeekDto {
    openingDate: string;
    closingDate: string;
    counter: number;
    flag: string;
}

export interface ClientsAccountsCountDto {
    groupby: number;
    count: number;
    statusType: string;
}

export interface LoginRequestDto {
    email: string;
    password: string;
}

export interface UserDto {
    id?: number;
    name: string;
    email: string;
    password: string;
    roles: any[];
    image?: any;
    imageName?: string;
    status?: string;
}

export interface RoleDto {
    id: number;
    name: string;
}

export interface ClientLogDto {
    id: number;
    userEmail: string;
    action: string;
    logDate: string;
    clientId: number;
    clientName: string;
    clientLastName: string;
}

export interface AccountLogDto {
    id: number;
    userEmail: string;
    action: string;
    logDate: string;
    clientId: number;
    clientName: string;
    accountId: number;
    accountName: string;
    accountType: string;
}