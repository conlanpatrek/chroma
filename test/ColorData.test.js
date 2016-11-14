import ColorData from 'Color/ColorData';
import { COLOR_MODES } from 'Color/Constants';

const testColorMode = (mode) => {
    const ensureMode = `ensure${mode}`,
        toMode = `to${mode}`;

    describe(
        `${ensureMode}()`,
        () => {
            describe(
                `When this.${mode} is null`,
                () => {
                    ['Null', ...COLOR_MODES].forEach(mode_too => {
                        if (mode_too === mode) return;

                        it(
                            `Returns the output of ${mode_too}.${toMode}() if ${mode_too === 'Null' ? 'no color modes': mode_too + ' values'} are set`,
                            () => {
                                let colorData = new ColorData({ [mode]: null, [mode_too]: 'test' });
                                let output = colorData[ensureMode]();
                                ColorData.Converters[mode_too][toMode].calledWith(colorData).should.be.true;
                                expect(output).to.eql(ColorData.Converters[mode_too][toMode].returnValues[0]);
                            }
                        )
                    });
                }
            );

            describe(
                `When this.${mode} is not null`,
                () => {
                    it(
                        'Returns itself',
                        () => {
                            let colorData = new ColorData({ [mode]: 'test' });
                            colorData[ensureMode]().should.equal(colorData)
                        }
                    );
                }
            );
            let colorData;
            beforeEach(() => {
                colorData = new ColorData();
            });
        }
    );
}

describe(
    'ColorData',
    () => {
        // Stub out conversion methods
        beforeEach(() => {
            [...COLOR_MODES, 'Null'].forEach(
                mode => {
                    COLOR_MODES.forEach(
                        mode_too => sinon.spy(ColorData.Converters[mode], `to${mode_too}`)
                    );
                }
            );
        });

        // Unstub conversion methods
        afterEach(() => {
            [...COLOR_MODES, 'Null'].forEach(
                mode => {
                    COLOR_MODES.forEach(
                        mode_too => ColorData.Converters[mode][`to${mode_too}`].restore()
                    );
                }
            );
        });

        COLOR_MODES.forEach(testColorMode);
    }
);
