import Color from 'Color/Color';
import { COLOR_MODES } from 'Color/Constants';

const colorDataDouble = () => {
    let data = COLOR_MODES.reduce((op, mode) => {
        op[mode] = `${mode}_VALUE`,
        op[`ensure${mode}`] = sinon.spy(colorDataDouble);
        return op;
    }, {});

    return data;
};

const testColorMode = (mode) => {
    describe(
        `${mode}()`,
        () => {
            let ensureMode = `ensure${mode}`,
                color;

            beforeEach(() => {
                color = new Color();
                color.colorData = colorDataDouble();
            });

            describe(
                'When called without arguments',
                () => {
                    it(
                        `Returns colorData.${mode}`,
                        () => {
                            color[mode]().should.equal(`${mode}_VALUE`);
                        }
                    );

                    it(
                        `Calls ${ensureMode}() on colorData`,
                        () => {
                            let colorData = color.colorData;
                            color[mode]();
                            colorData[ensureMode].called.should.be.true;
                        }
                    );

                    it(
                        `Replaces colorData with the output of ${ensureMode}()`,
                        () => {
                            let colorData = color.colorData;
                            color[mode]();
                            color.colorData.should.not.equal(colorData);
                            color.colorData.should.equal(colorData[ensureMode].returnValues[0]);
                        }
                    );
                }
            );

            describe(
                'When called with arguments',
                () => {
                    it(
                        `Sets a new colorData with the provided ${mode} value`,
                        () => {
                            let colorData = color.colorData;
                            color[mode]('test');
                            color.colorData.should.not.equal(colorData);
                            color.colorData[mode].should.equal('test');
                        }
                    );
                }
            );
        }
    );
};

describe(
    'Color',
    () => {
        COLOR_MODES.forEach(testColorMode);
    }
);
