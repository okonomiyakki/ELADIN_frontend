import IDB from "./indexedDB.js";

const cartUl = document.querySelector(".cart-section-list");
const allSelectBtn = document.querySelector(".cart-list-all-select-btn");
const allDeleteBtn = document.querySelector(".cart-list-all-select-delete");
const nonOrderBtn = document.querySelector(".no-user-order-btn");
const orderBtn = document.querySelector(".user-order-btn");
const cartAlert = document.querySelector(".cart-alert");

//모달
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-text");
const closeModalBtn = document.querySelector(".close-modal-btn");

class CartSection {
    constructor() {
        this.selectCount = [];
    }

    addSectionEvent() {
        allSelectBtn.addEventListener("click", (e) => {
            const checkBoxList = document.querySelectorAll(
                ".cart-section-item-select"
            );

            checkBoxList.forEach((checkBox) => {
                checkBox.checked = e.target.checked;
                if (
                    e.target.checked &&
                    !this.selectCount.includes(checkBox.value)
                ) {
                    this.selectCount.push(checkBox.value);
                    IDB.updateIDB(Number(checkBox.value), true);
                } else if (!e.target.checked) {
                    this.selectCount = [];
                    IDB.updateIDB(Number(checkBox.value), false);
                }
            });
            this.sectionRender();
        });

        allDeleteBtn.addEventListener("click", (e) => {
            openAlert();
            confirmButton.addEventListener("click", () => {
                cartAlert.style.display = "none";
                IDB.clearIDB();
                location.reload();
                this.selectCount = [];
                this.sectionRender();
            });
        });

        nonOrderBtn.addEventListener("click", async (e) => {
            if (this.selectCount.length === 0) {
                e.preventDefault();
                // alert('주문하실 상품이 없습니다.');
                modalContent.innerHTML = "선택하신 상품이 없습니다.";
                openModal();
            } else {
                // Update the order property of the selected items
                // You can remove this part if you don't need it anymore
                // this.selectCount.map((num) => {
                //     IDB.updateIDB({ num: num });
                // });
            }
        });

        orderBtn.addEventListener("click", async (e) => {
            if (!localStorage.getItem("accessToken") &&
                this.selectCount.length > 0) {
                e.preventDefault();
                // alert("로그인 후 이용해주세요.");
                modalContent.innerHTML = "로그인 후 이용해주세요.";
                openModal();
                setTimeout(() => {
                    location.href = "./login.html";
                }, 2000);
                closeModalBtn.addEventListener("click", () => {
                    location.href = "./login.html";
                });
            }

            if (this.selectCount.length === 0) {
                e.preventDefault();
                // alert('주문하실 상품이 없습니다.');
                modalContent.innerHTML = "선택하신 상품이 없습니다.";
                openModal();

                return;
            }
            // Update the order property of the selected items
            // You can remove this part if you don't need it anymore
            // this.selectCount.map((num) => {
            //     IDB.updateIDB({ num: num });
            // });
        });
    }

    totalCountRender() {
        const totalCount = document.querySelector(
            ".cart-section-select-item-count-text"
        );
        const totalCountIco = document.querySelector(
            ".cart-section-select-check-ico"
        );
        if (this.selectCount.length > 0) {
            totalCount.innerHTML = `${this.selectCount.length}개를 선택하셨습니다.`;
            totalCount.classList.remove("text-no");
            totalCountIco.classList.remove("ico-no");
        } else {
            totalCount.innerHTML = "선택한 상품이 없습니다.";
            totalCount.classList.add("text-no");
            totalCountIco.classList.add("ico-no");
        }
    }

    totalAmountRender() {
        const totalAmount = document.querySelector(
            ".cart-section-select-item-total-amount"
        );
        const selectAmount = document.querySelectorAll(
            ".cart-section-item-price"
        );
        let amount = 0;
        selectAmount.forEach((item) => {
            if (this.selectCount.includes(item.getAttribute("value"))) {
                amount += parseInt(item.innerText.replace(/,/g, ""));
            }
        });

        totalAmount.innerText = `${amount.toLocaleString()}원`;
    }

    sectionRender() {
        this.totalCountRender();
        this.totalAmountRender();
    }
}

class Cart extends CartSection {
    constructor(target, selectCount) {
        super(selectCount);
        this.target = target;
        this.state;
    }

    async setState() {
        this.state = await IDB.getAllIDB();
    }

    async innerHTML() {
        
    }

    async template() {
        await this.setState();
        const cartList = this.state;

        let template = "";

        if (cartList.length === 0) {
            template += `
                <div class="no-items mt30" style="display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 40px;">
                    <div class="no-items-img">
                        <img src="../img/eladin_genie.png" alt="엘라딘 이미지" style="width: 30%;">
                    </div>
                    <div class="no-items-cont">
                        <p style="font-size: 24px; font-weight: 500;">장바구니가 텅 비었어요~</p>
                    </div>
                </div>
            `;
        } else {
            cartList.map((item) => {
                //원화 단위로 변환
                const formattedPrice = item.price.toLocaleString() + "원";

                template += `
                <li class="cart-section-item">
                    <div class="cart-section-item-selcet-box">
                        <input
                            type="checkbox"
                            class="cart-section-item-select"
                            value=${item.id}
                        />
                    </div>
                    <img
                        src=${item.imgUrl}
                        alt=""
                        class="cart-section-item-img"
                    />
                    <div class="cart-section-item-introduce">
                        <div class="cart-section-item-title">
                            ${item.title}
                        </div>
                        <div class="cart-section-item-author">
                            ${item.author}
                        </div>
                        <div class="cart-section-item-btns">
                            <button
                                type="button"
                                class="cart-section-item-delete-btn"
                                value=${item.id}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                    <div class="cart-section-item-price-box">
                        <span class="cart-section-item-price"
                        value=${item.id} data-price=${item.price}</span>            
                        ${formattedPrice}</span
                        >
                        <div class="cart-section-quantity-btn">
                            <button type="button" class="minus-btn"></button>
                            <input type="number" class="item-quantity" value="${item.quantity}" id=${item.id} readonly>
                            <button type="button" class="plus-btn"></button>
                        </div>
                    </div>
                </li>
            `;
            });
        }

        return template;
    }

    async addEvent() {
        this.target.addEventListener("click", (e) => {
            if (e.target.classList.contains("cart-section-item-select")) {
                if (this.selectCount.includes(e.target.value)) {
                    this.selectCount.splice(
                        this.selectCount.indexOf(e.target.value),
                        1
                    );
                    IDB.updateIDB(Number(e.target.value), false);
                } else {
                    this.selectCount.push(e.target.value);
                    IDB.updateIDB(Number(e.target.value), true);
                }
            }

            if (e.target.classList.contains("cart-section-item-delete-btn")) {
                openAlert();
                const confirmButton = document.querySelector(".confirm-button");
     
                confirmButton.addEventListener('click', (ev) => {
                    ev.stopImmediatePropagation();
                    IDB.deleteIDB(Number(e.target.value));
                    location.reload();
                })
            }
            this.sectionRender();

            if (e.target.classList.contains("minus-btn")) {
                const key = Number(e.target.nextElementSibling.getAttribute('id'))
                const quantity = e.target.nextElementSibling;
                const priceElement = e.target
                    .closest(".cart-section-item-price-box")
                    .querySelector(".cart-section-item-price");
                const originalPrice = parseInt(priceElement.dataset.price);

                if (quantity.value > 1) {
                    quantity.value -= 1;
                    IDB.updateQuantityIDB(key, quantity.value)
                    const updatedPrice = originalPrice * quantity.value;
                    priceElement.innerText =
                        updatedPrice.toLocaleString() + "원";
                    this.sectionRender(); // Call sectionRender after updating the price
                }
            }

            if (e.target.classList.contains("plus-btn")) {
                const key = Number(e.target.previousElementSibling.getAttribute('id'))
                const quantity = e.target.previousElementSibling;
                const priceElement = e.target
                    .closest(".cart-section-item-price-box")
                    .querySelector(".cart-section-item-price");
                const originalPrice = parseInt(priceElement.dataset.price);

                quantity.value = Number(quantity.value) + 1;
                IDB.updateQuantityIDB(key, quantity.value)
                const updatedPrice = originalPrice * quantity.value;
                priceElement.innerText = updatedPrice.toLocaleString() + "원";
                this.sectionRender(); // Call sectionRender after updating the price
            }
        });
    }

    async render() {
        const template = await this.template();

        this.target.innerHTML = template;
        this.sectionRender();
        this.addSectionEvent();
        this.addEvent();
    }
}

const cart = new Cart(cartUl);
cart.render();

// 모달
function openModal() {
    modal.classList.add("active");
    setTimeout(() => {
        modal.classList.remove("active");
    }, 2000);
}
closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});


//삭제 모달
const closeButton = document.querySelector(".close-alert");
const cancelButton = document.querySelector(".cancel-button");
const confirmButton = document.querySelector(".confirm-button");

closeButton.addEventListener("click", closeAlert);
cancelButton.addEventListener("click", closeAlert);



function closeAlert() {
    cartAlert.style.display = "none";
}

function openAlert() {
    cartAlert.style.display = "flex";
}
// 비회원주문하기 경로
const guestOrderButton = document.querySelector('.no-user-order-btn');

guestOrderButton.addEventListener('click', () => {
    if(localStorage.getItem("uuid")){
        document.querySelector('.cart-section-btns a:first-child').setAttribute('href', "./order.html");
    }
});

if(localStorage.getItem("accessToken")){
    const cartSectionBtns = document.querySelector(".cart-section-btns");
    const firstChild = cartSectionBtns.children[0];
    cartSectionBtns.removeChild(firstChild);
    document.querySelector('.user-order-btn').innerText = "주문 하기"
}