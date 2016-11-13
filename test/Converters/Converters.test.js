import { Record } from 'immutable';
import Converters from 'Color/Converters';
import { COLOR_MODES } from 'Color/Constants';
import Answers from './answers.json';

const SOLO_MODE = null;
const MODE_MATCH_DEPTH = {
    'RGB': {r: 0, g: 0, b: 0},
    'CMYK': {c: 2, m: 2, y: 2, k: 2},
    'HSL': {h: 0, s: 2, l: 2},
    'HSV': {h: 0, s: 2, v: 2}
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
                                            Math.pow(.1, MODE_MATCH_DEPTH[toMode][channel])
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

