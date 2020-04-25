import { newConfeatureFlag } from "../index";

describe("newConfeatureFlag", () => {
  it("accepts object for its configuration", () => {
    const configuration = JSON.parse(`{
      "my_super_feature": {
        "release_for":["dev","qa"]
      }
    }`);

    expect(() => {
      newConfeatureFlag(configuration, "dev");
    }).not.toThrow();
  });

  it("accepts json for its configuration", () => {
    const configuration = `{
      "my_super_feature": {
        "release_for":["dev","qa"]
      }
    }`;

    expect(() => {
      newConfeatureFlag(configuration, "dev");
    }).not.toThrow();
  });

  it('throws an exception when "realese_for" value is not an array', () => {
    const configuration = `{
      "my_super_feature": {
        "release_for": ""
      }
    }`;

    expect(() => {
      newConfeatureFlag(configuration, "prod");
    }).toThrow(TypeError);
    expect(() => {
      newConfeatureFlag(configuration, "prod");
    }).toThrow("release_for in my_super_feature is expecting an array");
  });

  it('throws an exception when a feature does not declare "release_for"', () => {
    const configuration = `{
      "my_super_feature": {}
    }`;

    expect(() => {
      newConfeatureFlag(configuration, "prod");
    }).toThrow(TypeError);
    expect(() => {
      newConfeatureFlag(configuration, "prod");
    }).toThrow('my_super_feature is missing "release_for"');
  });
});

describe("isMySuperFeatureReleased", () => {
  it("returns true when a feature is released for the environment", () => {
    const configuration = `{
      "my_super_feature": {
        "release_for":["dev","qa"]
      }
    }`;

    const confeatureFlag = newConfeatureFlag(configuration, "dev");

    expect(confeatureFlag.isMySuperFeatureReleased()).toEqual(true);
  });

  it("returns false when a feature is not released for the environment", () => {
    const configuration = `{
      "my_super_feature": {
        "release_for":["dev","qa"]
      }
    }`;

    const confeatureFlag = newConfeatureFlag(configuration, "prod");

    expect(confeatureFlag.isMySuperFeatureReleased()).toEqual(false);
  });
});

describe("isMySuperFeatureReleasedFor", () => {
  it("returns true when a context provided on the fly is released for", () => {
    const configuration = `{
      "my_super_feature": {
        "release_for":["dev","qa", "username"]
      }
    }`;

    const confeatureFlag = newConfeatureFlag(configuration, "prod");

    expect(confeatureFlag.isMySuperFeatureReleasedFor("username")).toEqual(
      true
    );
  });

  it("returns false when a context provided on the fly is not released for", () => {
    const configuration = `{
      "my_super_feature": {
        "release_for":["dev","qa", "username"]
      }
    }`;

    const confeatureFlag = newConfeatureFlag(configuration, "prod");

    expect(
      confeatureFlag.isMySuperFeatureReleasedFor("another username")
    ).toEqual(false);
  });
});
