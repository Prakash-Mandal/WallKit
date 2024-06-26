// Put your application javascript here
if (document.getElementById("sort_by") != null) {
    document.querySelector("#sort_by").addEventListener("change", function (e) {
        var url = new URL(window.location.href);
        url.searchParams.set("sort_by", e.currentTarget.value);

        window.location = url.href;
    });
}

if(document.getElementById('address-country') != null) {
    document.getElementById('address-country').addEventListener('change', function(e){
        var provinces = this.options[this.selectedIndex].getAttribute('data-provinces');
        var provinceSelector = document.getElementById('address-province');
        var provinceArray = JSON.parse(provinces);

        if( provinceArray.length < 1) {
            provinceSelector.setAttribute('disabled', 'disabled');
        } else {
            provinceSelector.removeAttribute('disabled');
        }

        provinceSelector.innerHTML = '';
        var options = '';
        for (let i = 0; i < provinceArray.length; i++) {
            options += '<option value="'+provinceArray[i][0]+'">'+provinceArray[i][0]+'</option>';
        }

        provinceSelector.innerHTML = options
    });
}

var lang = document.querySelector("#localeInfo");
var locale = lang.getAttribute("locale") == 'en' ? '' : lang.getAttribute("locale") + '/';

var productInfoAnchor = document.querySelectorAll("#productInfoAnchor");

if (productInfoAnchor.length > 0) {

    var productInfoModal = new bootstrap.Modal(
        document.getElementById("productInfoModal", {})
    );
    productInfoAnchor.forEach((item) => {
        item.addEventListener("click", (event) => {

            let handle = item.getAttribute("product-handle");
            let price = item.getAttribute("product-price");
            let maxprice = item.getAttribute("product-max-price");
            let variantSelect = document.getElementById('modalItemID');
            let url = "/" + locale + "products/" + handle + ".js";
            fetch(url)
                .then((response) => response.json())
                .then(function (data) {
                    if (data.featured_image)
                        document.getElementById('productInfoImg').src = data.featured_image;
                    if (data.title)
                        document.getElementById('productInfoTitle').innerHTML = data.title;
                    if (data.compare_at_price)
                        document.getElementById('productInfoPrice').innerHTML = '<strike>' + maxprice + '</strike>' + price;
                    else
                        document.getElementById('productInfoPrice').innerHTML = price;
                    if (data.description)
                        document.getElementById('productInfoDescription').innerHTML = data.description.substring(0, 1000);
                    if (data.variants) {
                        var variants = data.variants;
                        variantSelect.innerHTML = '';
                        variants.forEach(function (variant, index) {
                            variantSelect.options[variantSelect.options.length] = new Option(variant.option1, variant.id)
                        });
                    }
                    document.getElementById("modalItemQuantity").value = 1;
                    productInfoModal.show();
                });
        });
    });


    let addToCartForm = document.querySelector('form#addToCartForm');
    let formData = new FormData(addToCartForm);

    addToCartForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let formData = {
            'items': [{
                'id': document.getElementById("modalItemID").value,
                'quantity': document.getElementById("modalItemQuantity").value
            }]
        };
        let url = "/" + locale + "cart/add.js";
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then((response) => response.json())
            .then(function (data) {
                productInfoModal.hide();
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    });
}

document.addEventListener('DOMContentLoaded', function () {
    update_cart();
});

function update_cart() {
    var cartCount = document.querySelector('#cart-count');
    let url = "/" + locale + "cart.js";
    fetch(url)
        .then((response) => response.json())
        .then(function (data) {
            if (data.item_count > 0)
                cartCount.innerHTML = data.item_count;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}