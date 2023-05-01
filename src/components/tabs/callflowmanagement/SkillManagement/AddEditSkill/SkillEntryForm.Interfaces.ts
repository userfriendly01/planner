
export interface SkillFormState {
    formMode: string,
    skillFriendlyName: string,
    skillNum: string,
    applicationId: number | null,
    taskQueue: string,
    profiles: any[],
    enableVirtualHold: boolean,
    vhCallTarget: {
      value: string,
      valid: boolean,
      e164: string,
      blurred: boolean
    },
    vhThreshold: string | null,
    timeOfDay: {
      sunday: number | null,
      monday: number | null,
      tuesday: number | null,
      wednesday: number | null,
      thursday: number | null,
      friday: number | null,
      saturday: number | null
    }
}