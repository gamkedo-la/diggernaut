const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const inventory = {
  activeTab: 'Gems',
  tabs: ['Gems', 'Artifacts', 'Bones'],
  contents: {
    Gems: Array(16).fill(0).map((_, index) => ({ index, owned: index % 2 === 0 })),
    Artifacts: Array(16).fill(0).map((_, index) => ({ index, owned: index % 2 === 1 })),
    Bones: Array(16).fill(0).map((_, index) => ({ index, owned: index % 2 === 0 }))
  },
  sprites: {
    image: new Image(),
    width: 50,
    height: 50
  }
};

inventory.sprites.image.src = 'gems.png';

function drawInventory() {
  // Draw inventory background
  ctx.fillStyle = '#ddd';
  ctx.fillRect(100, 50, 600, 500);

  // Draw tabs
  inventory.tabs.forEach((tab, index) => {
    const tabX = 100 + index * 200;
    const isActive = tab === inventory.activeTab;

    ctx.fillStyle = isActive ? '#ccc' : '#aaa';
    ctx.fillRect(tabX, 50, 200, 50);

    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isActive ? '#000' : '#333';
    ctx.fillText(tab, tabX + 100, 75);
  });

  // Draw contents
  const contents = inventory.contents[inventory.activeTab];
  const { width, height } = inventory.sprites;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const item = contents[row * 4 + col];
      if (!item.owned) continue;

      const spriteX = (item.index % 4) * width;
      const spriteY = Math.floor(item.index / 4) * height;
      const x = 110 + col * (width + 10);
      const y = 120 + row * (height + 10);

      ctx.drawImage(
        inventory.sprites.image,
        spriteX,
        spriteY,
        width,
        height,
        x,
        y,
        width,
        height
      );
    }
  }
}

function handleClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  inventory.tabs.forEach((tab, index) => {
    const tabX = 100 + index * 200;
    const tabY = 50;
    const tabWidth = 200;
    const tabHeight = 50;

    if (x >= tabX && x <= tabX + tabWidth && y >= tabY && y <= tabY + tabHeight) {
      inventory.activeTab = tab;
      drawInventory();
    }
  });
}

canvas.addEventListener('click', handleClick);

// Draw initial state
inventory.sprites.image.onload = () => {
  drawInventory();
};
