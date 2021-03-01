import {
  ACTION_TYPE,
  ALERT_MESSAGE,
  JS_SELECTOR,
} from "../../constants/index.js";
import {
  $,
  toDataAttributeSelector as toDAS,
  generateLottoNumbers,
} from "../../utils/index.js";
import { Lotto } from "../../models/index.js";
import store from "../../store/index.js";
import { EmptyInputError, ValidationError } from "../../errors/index.js";
import Presentational from "./Presentational.js";

const createContainer = () => {

  const toNumber = (cashInputValue) => {
    if (cashInputValue === "") {
      throw new EmptyInputError(ALERT_MESSAGE.ERROR.CASH_INPUT.NOT_A_NUMBER);
    }

    return Number(cashInputValue);
  };

  const validate = (cash) => {
    if (cash < Lotto.UNIT_PRICE) {
      throw new ValidationError(
        ALERT_MESSAGE.ERROR.CASH_INPUT.UNDER_LOTTO_PRICE
      );
    }
  };

  const createLottos = (cash) => {
    const lottoCount = Math.floor(cash / Lotto.UNIT_PRICE);

    return [...Array(lottoCount)].map(() => new Lotto(generateLottoNumbers()));
  };

  const createLottosAfterValidation = (event) => {
    event.preventDefault();

    const $cashInput = event.target.elements[JS_SELECTOR.CASH.INPUT];

    try {
      const cash = toNumber($cashInput.value);
      validate(cash);

      store.dispatch({
        type: ACTION_TYPE.LOTTOS.ADDED,
        payload: createLottos(cash),
      });
    } catch (error) {
      if (
        error instanceof EmptyInputError ||
        error instanceof ValidationError
      ) {
        alert(error.message);
        $cashInput.clear();
        $cashInput.focus();
        return;
      }

      throw error;
    }
  };

  const select = (state) => state.lottos;

  let currentLottos = select(store.getState());

  const render = () => {
    let previousLottos = currentLottos;
    currentLottos = select(store.getState());

    const hasChanged = previousLottos !== currentLottos;

    if (!hasChanged) return;

    Presentational.render();
  };

  const init = () => {
    Presentational.init({ createLottosAfterValidation });
    store.subscribe(render);
  };

  return { init };
};

const CashContainer = createContainer();

export default CashContainer;
