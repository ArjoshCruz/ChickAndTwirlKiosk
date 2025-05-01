// JQUERY SECTION FOR COMPUTATION OF TOTAL ORDER PRICE
$(document).ready(function () {
  const $orderList = $('#order-list');
  const $orderTotal = $('#money');
  let total = 0;
  let orderItems = [];

  function formatCurrency(amount) {
    return `₱${amount.toFixed(2)}`;
  }

  // Add to order
  $('button[data-name]').on('click', function () {
    const $button = $(this);
    const name = $button.data('name');
    const price = parseFloat($button.data('price'));
    const quantity = parseInt($button.closest('div').find('input[type="number"]').val()) || 1;

    const itemTotal = price * quantity;

    const $existingItem = $orderList.children().filter(function () {
      return $(this).data('name') === name;
    });

    if ($existingItem.length > 0) {
      const oldQty = parseInt($existingItem.data('quantity'));
      const newQty = oldQty + quantity;
      const newItemTotal = price * newQty;

      $existingItem.data('quantity', newQty);
      $existingItem.data('item-total', newItemTotal);
      $existingItem.find('h4').text(`Qty: ${newQty}`);
      $existingItem.find('p').text(`Total: ${formatCurrency(newItemTotal)}`);

      const existing = orderItems.find(item => item.name === name);
      if (existing) {
        existing.quantity = newQty;
        existing.price = newItemTotal;
      }

      total += itemTotal;
    } else {
      const $li = $(`
        <li data-name="${name}" data-quantity="${quantity}" data-item-total="${itemTotal}">
          <div class="bg-white text-gray-800 p-3 rounded shadow flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold">${name}</h3>
              <h4 class="text-sm">Qty: ${quantity}</h4>
              <p class="text-sm font-medium">Total: ${formatCurrency(itemTotal)}</p>
            </div>
            <button class="remove-btn text-red-600 font-bold ml-4">Remove</button>
          </div>
        </li>
      `);

      $orderList.append($li);
      total += itemTotal;

      orderItems.push({ name, quantity, price: itemTotal });

      $li.find('.remove-btn').on('click', function () {
        const toRemove = parseFloat($li.data('item-total'));
        total -= toRemove;

        const nameToRemove = $li.data('name');
        orderItems = orderItems.filter(item => item.name !== nameToRemove);

        $li.remove();
        $orderTotal.text(total.toFixed(2));
      });
    }

    $orderTotal.text(total.toFixed(2));
  });

  // Pay button
  $('#pay-button').on('click', function () {
    const amountGiven = parseFloat($('#amount').val());

    if (!amountGiven) {
      alert('Please enter an amount.');
      return;
    }

    if (amountGiven < total) {
      alert('Insufficient amount. Please enter more.');
      return;
    }

    // Show confirmation modal
    $('#confirmationModal').removeClass('hidden');

    // Remove any previous click listeners before adding new ones
    $('#confirmPayment').off('click').on('click', function () {
      const change = amountGiven - total;

      $('#orderNo').text(`#CT${Math.floor(Math.random() * 9000) + 1000}`);
      $('#orderDate').text(new Date().toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
      $('#modalTotal').text(`₱${total.toFixed(2)}`);
      $('#amountGiven').text(`₱${amountGiven.toFixed(2)}`);
      $('#changeAmount').text(`₱${change.toFixed(2)}`);

      const $itemsContainer = $('#modalOrderItems');
      $itemsContainer.empty();

      orderItems.forEach(item => {
        $itemsContainer.append(`
          <div class="flex justify-between text-sm">
            <span>${item.name} x${item.quantity}</span>
            <span>₱${item.price.toFixed(2)}</span>
          </div>
        `);
      });

      // Show receipt modal
      $('#paymentModal').removeClass('hidden');

      // Reset cart
      $orderList.empty();
      $('#amount').val(0);
      total = 0;
      $orderTotal.text('0.00');
      orderItems = [];

      // Close confirmation modal
      $('#confirmationModal').addClass('hidden');
    });

    // Remove old cancel listener too
    $('#cancelPayment').off('click').on('click', function () {
      $('#confirmationModal').addClass('hidden');
    });
  });

  // Manual close of confirmation modal
  $('#closeConfirmationModal').on('click', function () {
    $('#confirmationModal').addClass('hidden');
  });

  // Close receipt modal
  $('#closeModal').on('click', function () {
    $('#paymentModal').addClass('hidden');
  });
});






// -----------------------------------------------------------------------------------------------------------------------------------

// JQUERY SECTION FOR PROCESSING ORDERS

// Menu Items
const menuData = [
  {
    category: "Limited Offers",
    items: [
      {
        name: "Twirl & Feast Combo",
        price: 400,
        description:
          "Get 1 pasta + 6 wings + garlic bread for a discounted price!",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZl7MXC22ZFfr88SLh8MsNw8FukA91B1gdFQ&s",
      },
      {
        name: "Couple’s Italian Platter",
        price: 869,
        description:
          "1 large pasta + 2 chicken dishes + drinks for a romantic dinner deal.",
        img: "https://www.paesana.com/hubfs/Blog/Italian-Table-Setting-with-people-eating-scrumptous-pasta-.jpg",
      },
    ],
  },
  {
    category: "Chicken Specialties",
    items: [
      {
        name: "Garlic Parmesan Chicken",
        price: 150,
        description: "",
        img: "https://thecozycook.com/wp-content/uploads/2024/05/Garlic-Parmesan-Chicken-f.jpg",
      },
      {
        name: "Lemon Pepper Chicken",
        price: 350,
        description: "",
        img: "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2024/01/Lemon-Pepper-Chicken-main.jpg",
      },
      {
        name: "4pcs Buffalo Wings",
        price: 180,
        description: "",
        img: "https://www.maggi.ph/sites/default/files/srh_recipes/404fd85ebe8a7c856ec711a85baa71ce.jpg",
      },
    ],
  },
  {
    category: "Pasta Twirls",
    items: [
      {
        name: "Classic Alfredo Pasta",
        price: 200,
        description: "",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuV0dQ0uJlxI7m0yPa1f_KK3R315juQXnx4A&s",
      },
      {
        name: "Penne Arrabiata",
        price: 229,
        description: "",
        img: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chicken_arrabiata_88408_16x9.jpg",
      },
    ],
  },
];

$(document).ready(function () {
  const $menuContainer = $("#menu-container");

  menuData.forEach((section) => {
    const $section = $(`
  <div class="mb-12">
    <h3 class="text-2xl font-semibold text-[#c62b2b] my-4">${section.category}</h3>
    <div class="grid md:grid-cols-3 gap-6"></div>
  </div>
`);

    section.items.forEach((item) => {
      // Card For Selected Item
      const $card = $(`
      <div class="hover:-translate-y-2 transition bg-white shadow-md rounded-lg p-6 text-center">
      <img src="${item.img}" alt="${
        item.name
      }" class="w-32 h-32 mx-auto" />
      <h4 class="text-xl font-medium text-gray-800 mt-4">${item.name}</h4>
      ${
        item.description
          ? `<p class="text-lg text-gray-600 my-2">${item.description}</p>`
          : ""
      }
      <p class="text-lg font-semibold text-gray-600 my-2">₱${
        item.price
      }</p>
      <p class="text-gray-600 mb-4">
        <label class="font-bold">Quantity:</label>
        <input type="number" value="1" min="1" max="10" class="w-16 text-center border border-gray-300 rounded-md ml-2" />
      </p>
      <p>
        <button class="add-to-order px-8 py-2 bg-[#d32f2f] rounded-md" data-name="${
          item.name
        }" data-price="${item.price}">
          Add to order
        </button>
      </p>
    </div>
  `);
      $section.find(".grid").append($card);
    });

    $menuContainer.append($section);
  });
});
