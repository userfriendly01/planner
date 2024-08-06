import { UMUser } from 'globals/interfaces'
import { updateUser } from './user'
import {
    getAttributesToResetDefaultSkills,
    getUserSkills,
    shouldWorkerBeUpdatedToDefaultSkills
} from 'services/workerAttributes'

export const resetWorkerSkillsToDefault = (workerSids : string[]) => {
    const workerUpdatePromises = workerSids.map(async workerSid => {
        try {
            const currentWorker: UMUser = await getUserSkills(workerSid)

            const currentWorkerAttributes = currentWorker.twilio_attributes;
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
        } catch (twilioerror) {
            return ({ // resolve so that we can capture all promise results regardless of failure
                reason: "Error occurred when trying to fetch current worker object",
                twilioerror,
                updated: false,
                workerSid
            });
        }
    });

    return Promise.all(workerUpdatePromises)
}