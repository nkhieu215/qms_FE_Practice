export interface ScanNVL100 {
  woId: string
  sapWo: string
  numOfReq: string
  lotNumber: string
  profileId: any
  profileCode: any
  profileName: any
  dnlnvl: Dnlnvl[]
}

export interface Dnlnvl {
  status: string
  createdAt: string
  updatedAt: string
  partNumber: PartNumber[]
  feederGroup: FeederGroup[]
  machine: Machine[]
}

export interface PartNumber {
  lstFeeder: any
  id: string
  partNumberCode: string
  name: string
  subPart: SubPart[]
}

export interface SubPart {
  id: string
  partNumberCode: string
  name: string
}

export interface FeederGroup {
  id: string
  createdAt: string
  feederGroupCode: string
  name: string
  type: string
  updatedAt: string
  feeders: Feeder[]
}

export interface Feeder {
  id: string
  entryDate: string
  feederCode: string
  qrFeeders: QrFeeder[]
  name: any
  numberSlot: string
  qrCode: any
  serial: string
  status: string
}

export interface QrFeeder {
  id: string
  qrFeederCode: string
  name: any
  note: any
  createdDate?: string
}

export interface Machine {
  id: string
  lineId: any
  machineName: string
  status: string
  lane: any
  workCenterId: any
  machineDetails: MachineDetail[]
  partNumber: any[]
  feeders: any[]
}

export interface MachineDetail {
  side: any
  feedersPrograming: FeedersPrograming[]
}

export interface FeedersPrograming {
  id: string
  entryDate: any
  serial: string
  status: string
  qrFeederCode: string
  dnlnvlDetailOfMaterial: DnlnvlDetailOfMaterialList[]
  slotMachine: any
}

export interface DnlnvlDetailOfMaterialList {
  materialId: string
  materialQuantity: string
}
