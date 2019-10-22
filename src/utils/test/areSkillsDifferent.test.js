import {
  areSkillsDifferent
} from "utils";

describe ("areSkillsDifferent", () => {

  test("should return false when default_skills is not defined", () => {
    const attributes = {
      whatever: "cool",
      routing: {
        skills: ["wow"],
        levels: {}
      }
    };
    expect(areSkillsDifferent(attributes)).toEqual(false);
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
    expect(areSkillsDifferent(attributes)).toEqual(false);
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
    expect(areSkillsDifferent(attributes)).toEqual(false);
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
    expect(areSkillsDifferent(attributes)).toEqual(false);
  });

  const testTrue = attributes => {
    test("should return true when default_skills differs from routing", () => {
      expect(areSkillsDifferent(attributes)).toEqual(true);
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