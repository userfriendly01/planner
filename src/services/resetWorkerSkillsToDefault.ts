import { UMUser } from 'globals/interfaces'
import { updateUser } from './user'
import {
    getAttributesToResetDefaultSkills,
    shouldWorkerBeUpdatedToDefaultSkills
} from 'utils/workerAttributesUtils'

export const resetWorkerSkillsToDefault = (workers : UMUser[]) => {
    const workerUpdatePromises = workers.map(async worker => {
        const workerSid = worker.sid;
        const currentWorkerAttributes = worker.attributes;
        const {reason, shouldUpdate} = shouldWorkerBeUpdatedToDefaultSkills(currentWorkerAttributes);
        if (!shouldUpdate) {
            return ({
                reason,
                updated: false,
                workerSid
            });
        } else {
            const attributesToUpdate = getAttributesToResetDefaultSkills(currentWorkerAttributes);
            const newAttributes = {
            ...currentWorkerAttributes,
            ...attributesToUpdate
            };
            try {
                const updatedWorker = await updateUser(workerSid, { attributes: newAttributes })

                return {
                    updated: true,
                    workerSid,
                    worker: updatedWorker
                }
            } catch (twilioerror) {
                return({ // resolve so that we can capture all promise results regardless of failure
                    reason: "Error occurred when trying to update worker",
                    twilioerror,
                    updated: false,
                    workerSid
                })
            }
        }
    });

    return Promise.all(workerUpdatePromises)
}