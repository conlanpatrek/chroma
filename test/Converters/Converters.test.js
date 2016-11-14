import { Record } from 'immutable';
import Converters from 'Color/Converters';
import { COLOR_MODES } from 'Color/Constants';
import Answers from './answers';

const SOLO_MODE = false;
const MODE_MATCH_DEPTH = {
    'RGB': {r: 1, g: 1, b: 1},
    'CMYK': {c: .01, m: .01, y: .01, k: .01},
    'HSL': {h: 1, s: .01, l: .01},
    'HSV': {h: 1, s: .01, v: .01}
}

let record = Record(
    COLOR_MODES.reduce(
        (op, mode) => {
            op[mode] = null;
            return op;
        },
        {}
    )
);

const testColorMode = (mode, solo) => {
    let converter = Converters[mode];
    describe(
        `${mode} Converter`,
        () => {
            if (SOLO_MODE && SOLO_MODE !== mode) {
                it(`Soloing ${SOLO_MODE}, skipped.`);
                return;
            }

            COLOR_MODES.forEach(
                mode_too => {
                    let toMode = `to${mode_too}`;
                    it(
                        `Has a ${toMode}() method`,
                        () => {
                            converter[toMode].should.be.a('function');
                        }
                    );

                    testConversionMethod(converter, toMode, mode, mode_too)
                }
            );
        }
    );
};

const testConversionMethod = (converter, conversionMethod, fromMode, toMode) => {
    describe(
        `${conversionMethod}()`,
        () => {
            Answers.forEach(
                answer => {
                    it(
                        `Converts ${JSON.stringify(answer[fromMode])} to ${JSON.stringify(answer[toMode])}`,
                        () => {
                            let colorData = record({ [fromMode]: answer[fromMode] });
                            if (MODE_MATCH_DEPTH[toMode]) {
                                let converted = converter[conversionMethod](colorData);

                                Object.keys(converted[toMode]).forEach(
                                    channel => {
                                        converted[toMode][channel].should.be.closeTo(
                                            answer[toMode][channel],
                                            MODE_MATCH_DEPTH[toMode][channel],
                                            `${JSON.stringify(converted[toMode])} should be close to ${JSON.stringify(answer[toMode])}`
                                        );
                                    }
                                );
                            } else {
                                converter[conversionMethod](colorData)[toMode].should.eql(answer[toMode]);
                            }
                        }
                    );
                }
            );
        }
    );
};

COLOR_MODES.forEach(testColorMode);

