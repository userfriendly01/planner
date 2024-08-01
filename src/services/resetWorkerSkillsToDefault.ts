import { updateUser } from './user'
import {
    getAttributesToResetDefaultSkills,
    getUserSkills,
    shouldWorkerBeUpdatedToDefaultSkills
} from 'utils/workerAttributeUtils'

export const resetWorkerSkillsToDefault = (workerSids : string[]) => {
    const workerUpdatePromises = workerSids.map(workerSid => new Promise(resolve => {
        getUserSkills(workerSid)
            .then(currentWorker => {
            const currentWorkerAttributes = currentWorker.twilio_attributes;
            const {
                reason,
                shouldUpdate
            } = shouldWorkerBeUpdatedToDefaultSkills(currentWorkerAttributes);
            if (!shouldUpdate) {
                resolve({
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
                console.log("THESE ARE THE NEW ATTRIBUTES", newAttributes);
                updateUser(workerSid, { attributes: newAttributes })
                .then(updatedWorker => resolve({
                    updated: true,
                    workerSid,
                    worker: updatedWorker
                }))
                .catch(twilioerror => resolve({ // resolve so that we can capture all promise results regardless of failure
                    reason: "Error occurred when trying to update worker",
                    twilioerror,
                    updated: false,
                    workerSid
                }));
            }
            })
            .catch(twilioerror => resolve({ // resolve so that we can capture all promise results regardless of failure
            reason: "Error occurred when trying to fetch current worker object",
            twilioerror,
            updated: false,
            workerSid
        }));
    }));

    return Promise.all(workerUpdatePromises)
}