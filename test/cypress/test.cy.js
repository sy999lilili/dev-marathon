describe("顧客情報入力フォームのテスト", () => {
  // 追加テスト1
  it("フォームが正しく表示されることを確認する", () => {
    cy.visit("/shiori_yonemura/customer/add.html");
    cy.get("#companyName").should("be.visible");
    cy.get("#industry").should("be.visible");
    cy.get("#contact").should("be.visible");
    cy.get("#location").should("be.visible");
  });

  // 追加テスト2
  it("必須項目が未入力の場合、確認画面に遷移しないこと", () => {
    cy.visit("/shiori_yonemura/customer/add.html");
    cy.get("#companyName").type("テスト株式会社");
    cy.get("#submit-button").click(); // 送信ボタンをクリック
    cy.url().should("not.include", "add-confirm.html");
  });

  it("顧客情報を入力して送信し、成功メッセージを確認する", () => {
    cy.visit("/shiori_yonemura/customer/add.html"); // テスト対象のページにアクセス
    cy.window().then((win) => {
      // windowのalertをスタブ化し、エイリアスを設定
      cy.stub(win, "alert").as("alertStub");
    });

    // テストデータの読み込み
    cy.fixture("customerData").then((data) => {
      // フォームの入力フィールドにテストデータを入力
      const uniqueContactNumber = `03-${Math.floor(
        1000 + Math.random() * 9000
      )}-${Math.floor(1000 + Math.random() * 9000)}`;
      cy.get("#companyName").type(data.companyName);
      cy.get("#industry").type(data.industry);
      cy.get("#contact").type(uniqueContactNumber);
      cy.get("#location").type(data.location);
    });

    // フォームの送信
    cy.get("#customer-form").submit();

    // 現在の画面が確認画面であることを確認
    cy.location("pathname").should("include", "add-confirm.html");

    cy.window().then((win) => {
      // 再度windowのalertをスタブ化し、エイリアスを設定
      cy.stub(win, "alert").as("alertStub");
    });

    // 遷移後の確認画面に送信ボタンがあることを確認してクリック
    cy.get("#submit-button").should("be.visible").click();

    cy.get("@alertStub").should(
      "have.been.calledOnceWith",
      "顧客情報が正常に保存されました。"
    );

    // フォームがリセットされたことを確認
    cy.get("#companyName").should("have.value", "");
    cy.get("#industry").should("have.value", "");
    cy.get("#contact").should("have.value", "");
    cy.get("#location").should("have.value", "");
    cy.wait(5000);
  });
});
