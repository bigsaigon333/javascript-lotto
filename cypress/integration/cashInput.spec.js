import { JS_SELECTOR } from "../../src/js/constants/index.js";
import { Lotto } from "../../src/js/models/index.js";
import { toDataAttributeSelector as toDAS } from "../../src/js/utils/querySelector.js";

describe("구입 금액 입력 테스트", () => {
  before(() => {
    cy.visit("/");
  });

  beforeEach(() => {
    cy.window().then((win) => cy.stub(win, "alert").as("windowAlert"));
  });

  it("초기화면에 구입 입력 Form이 보여진다.", () => {
    cy.get(toDAS(JS_SELECTOR.CASH.CONTAINER)).should("be.visible");
    cy.get(toDAS(JS_SELECTOR.CASH.INPUT)).should("be.visible");
    cy.get(toDAS(JS_SELECTOR.CASH.BUTTON)).should("be.visible");
    cy.get(toDAS(JS_SELECTOR.ISSUE_MANAGER.CONTAINER)).should("not.be.visible");
    cy.get(toDAS(JS_SELECTOR.LOTTO_DETAIL.CONTAINER)).should("not.be.visible");
    cy.get(toDAS(JS_SELECTOR.WINNING_NUMBER.CONTAINER)).should(
      "not.be.visible"
    );
    cy.get(".modal").should("not.be.visible");
  });

  it("유저가 유효한 금액을 입력한 경우, 입력된 금액으로 살 수 있는 로또 장수 만큼에 대한 로또 번호 입력칸이 표시된다", () => {
    const userInput = 4500;
    const lottoCount = Math.floor(userInput / Lotto.UNIT_PRICE);

    cy.get(toDAS(JS_SELECTOR.CASH.INPUT)).type(userInput);
    cy.get(toDAS(JS_SELECTOR.CASH.BUTTON)).click();

    cy.get(toDAS(JS_SELECTOR.ISSUE_MANAGER.CONTAINER)).should("be.visible");
    cy.get(toDAS(JS_SELECTOR.ISSUE_MANAGER.TITLE)).should(
      "have.text",
      `총 ${lottoCount}개의 로또를 발급가능합니다.`
    );

    cy.get(toDAS(JS_SELECTOR.ISSUE_MANAGER.ENTRY_LIST))
      .children()
      .should("have.length", lottoCount);

    cy.get(toDAS(JS_SELECTOR.CASH.INPUT)).should("have.value", "");
  });
});
