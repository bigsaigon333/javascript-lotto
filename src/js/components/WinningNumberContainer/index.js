import {
  ACTION_TYPE,
  CLASSNAME,
  SUGGESTION_MESSAGE,
} from "../../constants/index.js";
import { CustomError } from "../../errors/index.js";
import store from "../../store/index.js";
import {
  readLottoNumber,
  validateLottoNumbersAreUnique,
} from "../../utils/index.js";
import Presentational from "./Presentational.js";

const select = (state) => state.lottos;

const createContainer = () => {
  const handleStateChange = (previousLottos) => {
    const currentLottos = select(store.getState());

    Presentational.render({
      isLottoInitialAdded: previousLottos.length === 0,
      isLottoCleared: currentLottos.length === 0,
    });
  };
  const createActionWinningNumberSet = (event) => {
    event.preventDefault();

    try {
      const { elements } = event.target;
      const $$inputs = elements[CLASSNAME.WINNING_NUMBER.INPUT];
      const $bonusInput = elements[CLASSNAME.WINNING_NUMBER.BONUS_INPUT];

      const numbers = Array.from($$inputs).map(($input) => {
        return readLottoNumber($input.value);
      });
      const bonusNumber = readLottoNumber($bonusInput.value);

      validateLottoNumbersAreUnique(...numbers, bonusNumber);

      store.dispatch({
        type: ACTION_TYPE.WINNING_NUMBER.SET,
        payload: {
          numbers,
          bonusNumber,
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        Presentational.notifyError(
          `${error.message} ${SUGGESTION_MESSAGE.LOTTO_NUMBERS_INPUT}`
        );
        return;
      }

      throw error;
    }
  };

  const init = () => {
    Presentational.init(createActionWinningNumberSet);
    store.subscribe(handleStateChange, select);
  };

  return { init };
};

const WinningNumberContainer = createContainer();

export default WinningNumberContainer;
