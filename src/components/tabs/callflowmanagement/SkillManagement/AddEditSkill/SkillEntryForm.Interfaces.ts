
export interface SkillFormState {
    formMode: string,
    skillFriendlyName: string,
    skillNum: string,
    applicationId: number | null,
    taskQueue: string,
    profiles: number[],
    vhCallTarget: string,
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