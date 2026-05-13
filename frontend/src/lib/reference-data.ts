export type ReferenceOption = {
  id: number;
  code: string;
  name: string;
};

export const provinces: ReferenceOption[] = [
  { id: 1, code: "AR-B", name: "Buenos Aires" },
  { id: 2, code: "AR-C", name: "Ciudad Autonoma de Buenos Aires" },
  { id: 3, code: "AR-K", name: "Catamarca" },
  { id: 4, code: "AR-H", name: "Chaco" },
  { id: 5, code: "AR-U", name: "Chubut" },
  { id: 6, code: "AR-X", name: "Cordoba" },
  { id: 7, code: "AR-W", name: "Corrientes" },
  { id: 8, code: "AR-E", name: "Entre Rios" },
  { id: 9, code: "AR-P", name: "Formosa" },
  { id: 10, code: "AR-Y", name: "Jujuy" },
  { id: 11, code: "AR-L", name: "La Pampa" },
  { id: 12, code: "AR-F", name: "La Rioja" },
  { id: 13, code: "AR-M", name: "Mendoza" },
  { id: 14, code: "AR-N", name: "Misiones" },
  { id: 15, code: "AR-Q", name: "Neuquen" },
  { id: 16, code: "AR-R", name: "Rio Negro" },
  { id: 17, code: "AR-A", name: "Salta" },
  { id: 18, code: "AR-J", name: "San Juan" },
  { id: 19, code: "AR-D", name: "San Luis" },
  { id: 20, code: "AR-Z", name: "Santa Cruz" },
  { id: 21, code: "AR-S", name: "Santa Fe" },
  { id: 22, code: "AR-G", name: "Santiago del Estero" },
  { id: 23, code: "AR-V", name: "Tierra del Fuego" },
  { id: 24, code: "AR-T", name: "Tucuman" },
];

export const propertyTypes: ReferenceOption[] = [
  { id: 1, code: "APARTMENT", name: "Apartment" },
  { id: 2, code: "HOUSE", name: "House" },
  { id: 3, code: "CABIN", name: "Cabin" },
  { id: 4, code: "HOTEL_ROOM", name: "Hotel Room" },
  { id: 5, code: "HOSTEL_ROOM", name: "Hostel Room" },
  { id: 6, code: "PRIVATE_ROOM", name: "Private Room" },
  { id: 7, code: "SHARED_ROOM", name: "Shared Room" },
  { id: 8, code: "STUDIO", name: "Studio" },
  { id: 9, code: "LOFT", name: "Loft" },
  { id: 10, code: "CHALET", name: "Chalet" },
  { id: 11, code: "COUNTRY_HOUSE", name: "Country House" },
  { id: 12, code: "VILLA", name: "Villa" },
  { id: 13, code: "BUNGALOW", name: "Bungalow" },
  { id: 14, code: "DUPLEX", name: "Duplex" },
  { id: 15, code: "CONDO", name: "Condominium" },
];

export function getProvinceName(provinceId: number) {
  return provinces.find((province) => province.id === provinceId)?.name ?? `Province #${provinceId}`;
}

export function getPropertyTypeName(propertyTypeId: number) {
  return (
    propertyTypes.find((propertyType) => propertyType.id === propertyTypeId)?.name ??
    `Property Type #${propertyTypeId}`
  );
}
