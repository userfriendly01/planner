import {
    getAttributesToResetDefaultSkills,
    getValidSkillsObject,
    shouldWorkerBeUpdatedToDefaultSkills,
} from "services/workerAttributes"

jest.mock("../../components/core/Auth/SharedGraphAPIProvider", () => ({
    apolloClient: {
      query: jest.fn()
    }
  }));

const defaultObject = {
skills: [],
levels: {}
};

describe("getAttributesToResetDefaultSkills", () => {
const doTest = (describeMsg, testMsg, attributesBefore, expectedPayload) => {
    describe(describeMsg, () => 
        test(testMsg, () =>
            expect(getAttributesToResetDefaultSkills(attributesBefore)).toEqual(expectedPayload)
        )
    );
};
doTest("all 3 attributes are default empty objects",
    "should return routing and disabled_skills of empty skills and levels", {
    default_skills: {
        skills: [],
        levels: {}
    },
    routing: {
        skills: [],
        levels: {}
    },
    disabled_skills: {
        skills: [],
        levels: {}
    }
    },
    {
    routing: {
        skills: [],
        levels: {}
    },
    disabled_skills: {
        skills: [],
        levels: {}
    }
    });
doTest("current skills contains skills and levels that are not in default skills and disabled_skills contains skills that are in default_skills", 
    "should add routing skills not found in default to disabled and should remove from disabled skills any skills found in default skills", {
    default_skills: {
        skills: ["1","2","3"],
        levels: {
        "1": 1,
        "2": 2
        }
    },
    routing: {
        skills: ["1","2","4","5"],
        levels: {
        "1": 1,
        "2": 2,
        "5": 5
        }
    },
    disabled_skills: {
        skills: ["3","6","7"],
        levels: {
        "3": 3,
        "7": 7
        }
    }
    },
    {
    routing: {
        skills: ["1","2","3"],
        levels: {
        "1": 1,
        "2": 2
        }
    },
    disabled_skills: {
        skills: ["6","7","4","5"],
        levels: {
        "5": 5,
        "7": 7
        }
    }
    });
doTest("default_skills is empty and routing has skills",
    "should add any skills in routing to disabled and should set routing to empty", {
    default_skills: {
        skills: [],
        levels: {}
    },
    routing: {
        skills: ["1","2","4","5"],
        levels: {
        "1": 1,
        "2": 2,
        "5": 5
        }
    },
    disabled_skills: {
        skills: ["3","6","7"],
        levels: {
        "3": 3,
        "7": 7
        }
    }
    },
    {
    routing: {
        skills: [],
        levels: {}
    },
    disabled_skills: {
        skills: ["3","6","7","1","2","4","5"],
        levels: {
        "3": 3,
        "7": 7,
        "1": 1,
        "2": 2,
        "5": 5
        }
    }
    });
doTest("default_skills has skills and routing has skills and disabled_skills has skills but there are no levels",
    "should add any skills in routing to disabled and should add empty levels object to routing and disabled_skills", {
    default_skills: {
        skills: ["1","2"]
    },
    routing: {
        skills: ["3","4"]
    },
    disabled_skills: {
        skills: ["1"]
    }
    },
    {
    routing: {
        skills: ["1","2"],
        levels: {}
    },
    disabled_skills: {
        skills: ["3","4"],
        levels: {}
    }
    });
});

describe("getValidSkillsObject", () => {

    describe("skillsObject is not a plain object", () => {

        test("should return default object if skillsObject is undefined", () => {
            expect(getValidSkillsObject()).toEqual(defaultObject);
        });
        test("should return default object if skillsObject is null", () => {
            expect(getValidSkillsObject(null)).toEqual(defaultObject);
        });
        test("should return default object if skillsObject is an array", () => {
            expect(getValidSkillsObject([])).toEqual(defaultObject);
        });
        test("should return default object if skillsObject is a string", () => {
            expect(getValidSkillsObject("cool")).toEqual(defaultObject);
        });
        test("should return default object if skillsObject is a number", () => {
            expect(getValidSkillsObject(12345)).toEqual(defaultObject);
        });
        test("should return default object if skillsObject is a boolean", () => {
            expect(getValidSkillsObject(true)).toEqual(defaultObject);
        });
    });

    describe("skillsObject is a plain object", () => {

        describe("skillsObject contains neither levels or skills", () => {

            test("should return default object if skillsObject is an empty object", () => {
                expect(getValidSkillsObject({})).toEqual(defaultObject);
            });
            test("should return default object if skillsObject does not contain levels or skills", () => {
                expect(getValidSkillsObject({
                random: "not cool",
                team: "wahhh",
                callerStates: ["boo"]
                })).toEqual({
                ...defaultObject,
                random: "not cool",
                team: "wahhh",
                callerStates: ["boo"]
                });
            });
        });

        describe("skills is not an array", () => {

            test("should return skills as empty array when skills is an object", () => {
                expect(getValidSkillsObject({
                skills: { wahh: "nooo" }
                }).skills).toEqual([]);
            });
            test("should return skills as empty array when skills is undefined", () => {
                expect(getValidSkillsObject({
                random: "nooo"
                }).skills).toEqual([]);
            });
            test("should return skills as empty array when skills is null", () => {
                expect(getValidSkillsObject({
                skills: null
                }).skills).toEqual([]);
            });
            test("should return skills as empty array when skills is a string", () => {
                expect(getValidSkillsObject({
                skills: "not cool"
                }).skills).toEqual([]);
            });
            test("should return skills as empty array when skills is a number", () => {
                expect(getValidSkillsObject({
                skills: 12345
                }).skills).toEqual([]);
            });
            test("should return skills as empty array when skills is a boolean", () => {
                expect(getValidSkillsObject({
                skills: true
                }).skills).toEqual([]);
            });
        });

        describe("skills is a valid array", () => {

            test("should return skills as empty array when skills is an empty array", () => {
                expect(getValidSkillsObject({
                skills: []
                }).skills).toEqual([]);
            });
            test("should return skills as array with skills when skills is populated", () => {
                expect(getValidSkillsObject({
                skills: ["cool", "wow", "awesome"]
                }).skills).toEqual(["cool", "wow", "awesome"]);
            });
        });

        describe("levels is not a plain object", () => {
            test("should return levels as empty object when levels is undefined", () => {
                expect(getValidSkillsObject({
                something: { wahh: "nooo" }
                }).levels).toEqual({});
            });
            test("should return levels as empty object when levels is string", () => {
                expect(getValidSkillsObject({
                levels: "noooo"
                }).levels).toEqual({});
            });
            test("should return levels as empty object when levels is number", () => {
                expect(getValidSkillsObject({
                levels: 123456
                }).levels).toEqual({});
            });
            test("should return levels as empty object when levels is array", () => {
                expect(getValidSkillsObject({
                levels: [1,2,3,4,5]
                }).levels).toEqual({});
            });
            test("should return levels as empty object when levels is null", () => {
                expect(getValidSkillsObject({
                levels: null
                }).levels).toEqual({});
            });
        });

        describe("levels is a plain object", () => {
            test("should return levels as empty object when levels is empty object", () => {
                expect(getValidSkillsObject({
                levels: {}
                }).levels).toEqual({});
            });
            test("should return levels as object with key values when levels is empty object with valid key value pairs", () => {
                expect(getValidSkillsObject({
                levels: {
                    "466": 3,
                    "psuL1": 2,
                    "psuL2": 1
                }
                }).levels).toEqual({
                "466": 3,
                "psuL1": 2,
                "psuL2": 1
                });
            });
        });

        describe("skills is valid and levels is not", () => {
            test("should return levels as empty object and skills as array", () => {
                expect(getValidSkillsObject({
                levels: "noooo",
                skills: ["cool", "wow"]
                })).toEqual({
                levels: {},
                skills: ["cool", "wow"]
                });
            });
        });

        describe("levels is valid and skills is not", () => {
            test("should return skills as empty array and levels as valid object", () => {
                expect(getValidSkillsObject({
                levels: {
                    "466": 3,
                    "psuL1": 2,
                    "psuL2": 1
                },
                skills: "wahhhh"
                })).toEqual({
                levels: {
                    "466": 3,
                    "psuL1": 2,
                    "psuL2": 1
                },
                skills: []
                });
            });
        });

        describe("levels is valid and skills is valid", () => {
            test("should return same skills and levels", () => {
                expect(getValidSkillsObject({
                levels: {
                    "466": 3,
                    "psuL1": 2,
                    "psuL2": 1
                },
                skills: ["cool", "wow"]
                })).toEqual({
                levels: {
                    "466": 3,
                    "psuL1": 2,
                    "psuL2": 1
                },
                skills: ["cool", "wow"]
                });
            });
        });
    });
});

describe ("shouldWorkerBeUpdatedToDefaultSkills", () => {

    test("should return false when default_skills is not defined", () => {
        const attributes = {
        whatever: "cool",
        routing: {
            skills: ["wow"],
            levels: {}
        }
        };
        expect(shouldWorkerBeUpdatedToDefaultSkills(attributes)).toEqual({
        reason: "No default_skills attribute exists on worker",
        shouldUpdate: false
        });
    });
    test("should return false when default_skills is null", () => {
        const attributes = {
        default_skills: null,
        whatever: "cool",
        routing: {
            skills: ["wow"],
            levels: {}
        }
        };
        expect(shouldWorkerBeUpdatedToDefaultSkills(attributes)).toEqual({
        reason: "No default_skills attribute exists on worker",
        shouldUpdate: false
        });
    });
    test("should return false when default_skills matches routing object", () => {
        const attributes = {
        default_skills: {
            skills: ["amazing", "wow", "socool"],
            levels: {
            amazing: 2,
            socool: 1
            }
        },
        whatever: "cool",
        routing: {
            skills: ["amazing", "wow", "socool"],
            levels: {
            amazing: 2,
            socool: 1
            }
        }
        };
        expect(shouldWorkerBeUpdatedToDefaultSkills(attributes)).toEqual({
        reason: "Worker default_skills is equal to currently assigned skills",
        shouldUpdate: false
        });
    });
    test("should return false when default_skills matches routing object regardless of order of arrays or object keys", () => {
        const attributes = {
        default_skills: {
            skills: ["amazing", "wow", "socool"],
            levels: {
            amazing: 2,
            socool: 1
            }
        },
        whatever: "cool",
        routing: {
            skills: ["wow", "socool", "amazing"],
            levels: {
            socool: 1,
            amazing: 2
            }
        }
        };
        expect(shouldWorkerBeUpdatedToDefaultSkills(attributes)).toEqual({
        reason: "Worker default_skills is equal to currently assigned skills",
        shouldUpdate: false
        });
    });

    const testTrue = attributes => {
        test("should return true when default_skills differs from routing", () => {
            expect(shouldWorkerBeUpdatedToDefaultSkills(attributes)).toEqual({
                reason: "Worker default_skills differs from currently assigned skills",
                shouldUpdate: true
            });
        });
    };

    testTrue({
        default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
            amazing: 2,
            socool: 1
        }
        },
        whatever: "cool",
        routing: {
        skills: ["wow", "socool", "amazing"],
        levels: {
            socool: 1,
            amazing: 3 // diff
        }
        }
    });
    testTrue({
        default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
            amazing: 2,
            socool: 1
        }
        // no routing
        }
    });
    testTrue({
        default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
            amazing: 2,
            socool: 1
        }
        },
        routing: {
        skills: 123456, // not valid array
        routing: 123456 // not obj
        }
    });
    testTrue({
        default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
            amazing: 2,
            socool: 1
        }
        },
        routing: {
        skills: ["amazing", "wow", "socool", "notindefault"], // contains skill not in default
        levels: {
            amazing: 2,
            socool: 1
        }
        }
    });
    testTrue({
        default_skills: {
        skills: ["amazing", "wow", "socool", "notincurrent"], // not in current
        levels: {
            amazing: 2,
            socool: 1
        }
        },
        routing: {
        skills: ["amazing", "wow", "socool"],
        levels: {
            amazing: 2,
            socool: 1
        }
        }
    });
    testTrue({
        default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
            amazing: 2,
            socool: 1,
            notincurrent: 9 // not in current
        }
        },
        routing: {
        skills: ["amazing", "wow", "socool"],
        levels: {
            amazing: 2,
            socool: 1
        }
        }
    });
    testTrue({
        default_skills: {
        skills: ["amazing", "wow", "socool"],
        levels: {
            amazing: 2,
            socool: 1
        }
        },
        routing: {
        skills: ["amazing", "wow", "socool"],
        levels: {
            amazing: 2,
            socool: 1,
            notindefault: 9 // not in default
        }
        }
    });
    testTrue({
        default_skills: {
        skills: ["amazing"],
        levels: {
            amazing: 2
        }
        },
        routing: {
        skills: ["amazing", "wow", "socool"],
        levels: {
            amazing: 2,
            socool: 1
        }
        }
    });
});