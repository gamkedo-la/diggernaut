const inventoryScreen = {

    // inventory screen will have 3 tabs: Treasure, Artifacts, and Map.
    activeTab: 0,
    totalTabs: 4,

    draw: function () {
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        
        //config.js > collectibles.ui contains configuration for the inventory screen
        //draw tabs
        let ui = collectibles.ui;
        canvasContext.fillStyle = COLORS[7];
        canvasContext.fillRect(ui.page.x, ui.page.y, ui.page.width, ui.page.height);

        ui.tabs.forEach((tab, index) => {
            canvasContext.fillStyle = COLORS[7];
            tabX = ui.page.x + 10 + (index * ui.tab.width) + index * ui.tab.margin;
            tabY = ui.page.y - ui.tab.height;
            tabColor = this.activeTab == index ? COLORS[7] : COLORS[6];
            canvasContext.fillStyle = tabColor;
            canvasContext.fillRect(tabX, tabY, ui.tab.width, ui.tab.height);
            gameFont.drawText(tab.name, {x: tabX + 5, y: tabY + 5}, 0, 0, 1, COLORS[2]);
        });

        this.tabDrawFunctions[ui.tabs[this.activeTab].name]();

        drawTransition();
        
    },

    tabDrawFunctions: {
        Treasure: function () {
            for(item in collectibles.Treasure){
                collectibles.Treasure[item].draw();
            }
        },
        Map: function () {
            return;
        }
    },

    update: function () {
        if (Key.justReleased(Key.i)) { signal.dispatch('returnToGame'); }
        if (Key.justReleased(Key.p)) { signal.dispatch('returnToGame'); }
        if (Joy.yReleased) { signal.dispatch('returnToGame'); }

        if (Key.justReleased(Key.LEFT)) {
            this.activeTab--;
            if (this.activeTab < 0) { this.activeTab = this.totalTabs - 1; }
        }
        if (Key.justReleased(Key.RIGHT)) {
            this.activeTab++;
            if (this.activeTab > this.totalTabs - 1) { this.activeTab = 0; }
        }
    }
}
