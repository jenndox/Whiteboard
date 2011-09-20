var squareCt = 600;
var squareLg = 2;
var pixelSquare = new Array();

var Tag = function (name, art, craft, tech, nearby, popularity, soon) {
    this.name = name;
    this.art = art;
    this.craft = craft;
    this.tech = tech;
    this.nearby = nearby;
    this.popularity = popularity;
    this.soon = soon;
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.draw = true;
};

Tag.prototype.inColorRange = function (cHigh, cLow, mHigh, mLow, yHigh, yLow) {
    
    if ((this.art > cHigh) || (this.art < cLow) ||
        (this.craft > mHigh) || (this.craft < mLow) ||
        (this.tech > yHigh) || (this.tech < yLow)) {

        return false;
    }
    else {
        return true;
    }
};

Tag.prototype.canFit = function (x, y, size) {
    size -= 1;
    var length = squareLg;
    var startX = Math.round((x - size)/squareLg) + 400;
    var startY = Math.round((y - size)/squareLg) + 400;
    var canFit = true;

    for (var i=0; i < size; i++)
    {
        for (var j=0; j < size; j++)
        {
            var place = (startY + j - 1) * squareCt + (startX + i - 1);
            if(pixelSquares[place] == true) {
                canFit = false;
            }
        }
    }
    if (canFit)
    { 

       for (var i=0; i < size; i++)
        {
            for (var j=0; j < size; j++)
            {
                var place = (startY + j) * squareCt + (startX + i);
                pixelSquares[place] = true;
            }
        }
    }
    return canFit;
};

Tag.prototype.drawBubbles = function (ctx, xVar, yVar, sizeVar, showBubbles) {
    ctx.save();
    var xFactor = this.nearby;
    var yFactor = this.popularity;
    var sizeFactor = this.soon;

    var oldX = this.x;
    var oldY = this.y;
    var oldSize = this.size;

    cColor = this.art / 100;
    mColor = this.craft / 100;
    yColor = this.tech / 100;
    kColor = 0;

    switch (xVar) {
        case "popularity":
            xFactor = this.popularity;
            break; 
        case "nearby":
            xFactor = this.nearby;
            break; 
        case "soon":
            xFactor = this.soon;
            break;
        case "colors":
            // Calculate isometric projection
            xFactor = (((this.tech-this.craft) * 0.8944) * 1/2 + 36) * 5/2;
            break;
        default:
            xFactor = this.popularity;
            break;
    } 
    switch (yVar) {
        case "popularity":
            yFactor = this.popularity;
            break; 
        case "nearby":
            yFactor = this.nearby;
            break; 
        case "soon":
            yFactor = this.soon;
            break;
        case "colors":
            // Calculate isometric projection
            yFactor = (((this.tech + this.craft)* 0.4472 - this.art) * 1/2 + 32) * 5/2;
            break;
        default:
            yFactor = this.popularity;
            break;
    } 
    switch (sizeVar) {
        case "popularity":
            sizeFactor = this.popularity;
            break; 
        case "nearby":
            sizeFactor = this.nearby;
            break; 
        case "soon":
            sizeFactor = this.soon;
            break;
        default:
            sizeFactor = this.popularity;
            break;
    } 

    newX = xFactor * 1.5 + 412;
    newY = yFactor * 1.65 - 20; 

    this.sizeFactor = sizeFactor
    var size = Math.round(sizeFactor / 5 + 2) ; // Calculate...

    rColor = (1 - Math.min( 1, cColor * ( 1 - kColor ) + kColor )) * 255;
    gColor = (1 - Math.min( 1, mColor * ( 1 - kColor ) + kColor )) * 255;
    bColor = (1 - Math.min( 1, yColor * ( 1 - kColor ) + kColor )) * 255;

    this.rColor = Math.round( rColor );
    this.gColor = Math.round( gColor );
    this.bColor = Math.round( bColor );

    if (this.canFit(newX, newY, size))
    {
        this.draw = true;
    }
    else {
        newX += size;
        newY += size;
        if (this.canFit(newX, newY, size))
        {
            this.draw = true;
        }
        else {
            newX -= 2 * size;
            newY -= 2 * size;
            if (this.canFit(newX, newY, size))
            {
                this.draw = true;
            }
            else {
                newX += 2 * size;
                if (this.canFit(newX, newY, size))
                {
                     this.draw = true;
                }
                else {
                    newX -= 2 * size;
                    newY += 2 * size;
                    if (this.canFit(newX, newY, size))
                    {
                        this.draw = true;
                    }
                    else {
                        this.draw = false; 
                    }
                }
            }
        }
    }

    if (this.draw) {
        if (showBubbles)
        {
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 1;
            ctx.shadowColor = "rgb(0, 0, 0)";
            ctx.fillStyle = "rgb(" + this.rColor + "," + this.gColor + "," + this.bColor + ")";

            ctx.moveTo(newX,newY);
            ctx.beginPath();
            ctx.arc(newX, newY, size, 0, Math.PI*2, true);
            ctx.fill();
        }
        this.x = newX + 150; // Save position for on click events
        this.y = newY + 250;
        this.size = size;
    }
    else {
        this.x = -100; // Save position for on click events
        this.y = -100;
        this.size = 0;    
    }
    ctx.restore();
}

Tag.prototype.drawText = function (ctx, showBubbles) {
    ctx.save();

    newX = this.x - 150; 
    newY = this.y - 250; 

    var size = Math.round(this.sizeFactor / 5 + 2) ; // Calculate...

    if (this.draw) {
        if (showBubbles)
        {
            ctx.font = (size / 2) + "px georgia";

            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.shadowBlur = 3;
            ctx.shadowColor = "rgb(" + this.rColor + "," + this.gColor + "," + this.bColor+ ")";
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillText(this.name, newX - size * 1/3, newY);
        }
        else
        {
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.shadowBlur = 3;
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.font = (size / 2) + "px georgia";
            ctx.fillStyle = "rgba(" + this.rColor + "," + this.gColor + "," + this.bColor+ ",1)";
            ctx.fillText(this.name, newX, newY + 160);
         }
    }
    ctx.restore();
}

var Cloud = function () {
    this.frame = [100, -200, 800, 800];
    this.duration = 10;

    this.tags = [
        new Tag("Art", 110, 0, 0, 50, 77, 102), 
        new Tag("Craft", 0, 110, 0, 55, 61, 96),
        new Tag("Tech", 0, 0, 110, 47, 41, 104),
        new Tag("2D", 60, 10, 80, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("3D", 50, 0, 70, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("3D Printing", 47, 28, 100, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Apparel", 87, 51, 24, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Arduino", 10, 20, 80, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Arts", 100, 0, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Astronomy", 30, 50, 80, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Audio", 70, 30, 70, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Ballistics", 0, 78, 72, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("BEAM", 10, 20, 60, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Beer", 54, 63, 78, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Beverages", 61, 42, 56, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Bicycles", 31, 73, 50, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Bikes", 45, 32, 90, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Biology", 22, 0, 80, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Blacksmithing", 88, 53, 18, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Canning", 21, 45, 13, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Cars", 10, 0, 87, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Cheesemaking", 54, 60, 12, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Chemistry", 10, 0, 90, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Circuit Bending", 43, 2, 100, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Circuits", 7, 0, 70, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("CNC", 87, 23, 43, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Communications", 10, 39, 87, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Computers", 40, 50, 90, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Crochet", 12, 87, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Culinary", 43, 89, 15, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Design", 62, 0, 50, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Desserts", 43, 98, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Drawing", 92, 10, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Electric Vehicles", 0, 0, 75, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Electronics", 30, 60, 90, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Fabrication", 14, 80, 60, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Fermentation", 50, 50, 20, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Film", 100, 23, 2, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Flight", 21, 0, 92, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Furniture", 50, 40, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Gadgets", 50, 0, 78, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Gaming", 40, 0, 92, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Gardening", 12, 80, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Glass", 100, 50, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("GPS", 0, 40, 63, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Grilling and Barbecue", 12, 95, 21, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Hacks and Mods", 34, 12, 87, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Halloween", 30, 70, 30, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Ham Radio", 23, 70, 70, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Heirloom Technology", 0, 40, 80, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Home", 60, 80, 43, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Home Entertainment", 100, 0, 50, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Homesteading", 0, 89, 10, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Infusions", 67, 43, 2, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Jewelry", 54, 89, 9, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Junkbots", 10, 56, 95, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Kids", 12, 98, 3, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Knitting", 22, 79, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Laser Cutting", 35, 0, 70, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Lego", 0, 70, 30, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Maintenance and Repair", 10, 80, 50, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Meat", 67, 98, 45, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Mechanics", 10, 60, 80, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)), 
        new Tag("Metalworking", 0, 95, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Mobile", 15, 0, 85, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Molecular Gastronomy", 80, 0, 80, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Motor", 0, 50, 60, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Music", 95, 10, 42, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Musical Instruments", 92, 0, 10, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Networking", 5, 0, 79, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Office", 70, 40, 78, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Open Source Hardware", 12, 1, 94, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Open Source Software", 9, 0, 89, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Outdoors", 23, 85, 21, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Painting", 94, 8, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Paper Airplane Surfing", 34, 0, 82, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Paper Crafts", 45, 97, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Performance", 92, 40, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Photography", 94, 0, 12, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Plush", 12, 85, 1, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Pranks",7, 23, 43, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Printmaking", 95, 43, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Programming", 52, 20, 82, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("PSP", 0, 54, 67, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Recycle", 23, 43, 78, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Remote Control", 0, 21, 93, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Repurposed Tech", 32, 56, 93, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Retro Tech", 12, 0, 99, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Robotics", 29, 12, 82, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Robots", 23, 32, 80, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Rocketry", 0, 10, 90, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Science Projects", 10, 10, 92, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Sculpture", 92, 21, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Sewing", 40, 92, 10, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Soft Circuits", 60, 60, 70, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Solar", 10, 10, 92, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Soldering", 82, 0, 62, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Spy", 20, 76, 92, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Telecommunications", 15, 0, 85, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Theater", 92, 62, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("UAVs", 0, 10, 90, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Vacuum Forming", 0, 92, 12, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Vegetarian", 30, 72, 12, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("VoIP", 0, 0, 91, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Watercraft", 23, 50, 28, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Wearables", 41, 89, 87, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Weaving", 0, 95, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Welding", 82, 0, 12, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Wind Energy", 10, 40, 85, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Wine", 21, 72, 21, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Wireless", 0, 20, 91, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Woodworking", 12, 91, 12, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Workshop", 34, 72, 9, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Encaustic", 92, 10, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Watercolor", 95, 0, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Oil", 98, 0, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Acrylic", 97, 0, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Figure Study", 89, 21, 0, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
        new Tag("Collabotron", 40, 40, 40, Math.floor(Math.random()*101), Math.floor(Math.random()*101), Math.floor(Math.random()*101)),
    ];

    for (var n = 0; n < this.tags.length; n++) {
        var tag = this.tags[n];
        this.tags[tag.name] = tag;
    }

    pixelSquares = new Array(); // 4 pixels each
    for (var i=0; i < squareCt*squareCt; i++) {
        pixelSquares[i] = false;
    }

};

Cloud.prototype.search = function (ctx, tagName, xVar, yVar, sizeVar, showBubbles) {
    for (var i=0; i < squareCt*squareCt; i++) {
        pixelSquares[i] = false;
    }

    for (var n = 0; n < this.tags.length; n++) {
        var tag = this.tags[n];
        if (tag.name.toLowerCase().indexOf(tagName.toLowerCase()) !=-1) {
            tag.drawBubbles(ctx, xVar, yVar, sizeVar, showBubbles);
        }
        else {
            tag.x = -101;
            tag.y = -101;
        }
    }    
    for (var n = 0; n < this.tags.length; n++) {
        var tag = this.tags[n];
        if (tag.name.toLowerCase().indexOf(tagName.toLowerCase()) !=-1) {
            tag.drawText(ctx, showBubbles);
        }
        else {
            tag.x = -101;
            tag.y = -101;
        }
    }    
};

Cloud.prototype.findClosest = function (ctx, x, y, scale) {
    for (var i=0; i < squareCt*squareCt; i++) {
        pixelSquares[i] = false;
    }

    var xDelta = 80;
    var yDelta = 250;
    var delta = xDelta + yDelta;
    var winningTag = "";
    x *= scale; // Account for zooming
    y *= scale;

    for (var n = 0; n < this.tags.length; n++) {
        var tag = this.tags[n];
        xDelta = Math.abs(x - tag.x);
        yDelta = Math.abs(y - tag.y);
        if (delta > xDelta + yDelta) {
            delta = xDelta + yDelta;
            winningTag = tag;
        }
    }    

    if (winningTag != "")
    {
        //alert(winningTag.name);
        ctx.save();

        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 1;
        ctx.shadowColor = "rgb(0, 0, 0)";
        ctx.fillStyle = "rgb(" + winningTag.rColor + "," + winningTag.gColor + "," + winningTag.bColor + ")";

        ctx.moveTo(winningTag.x,winningTag.y);
        ctx.beginPath();
        ctx.arc(winningTag.x,winningTag.y, size * 2, 0, Math.PI*2, true);
        ctx.fill();

        ctx.font = size + "px georgia";

        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 3;
        ctx.shadowColor = "rgb(" + winningTag.rColor + "," + winningTag.gColor + "," + winningTag.bColor+ ")";
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillText(winningTag.name, winningTag.x - size * 2/3, winningTag.y - winningTag.size);
        ctx.fillText(winningTag.soon, winningTag.x - size * 2/3, winningTag.y);
        ctx.fillText(winningTag.nearby, winningTag.x - size * 2/3, winningTag.y + winningTag.size);
        ctx.fillText(winningTag.popularity, winningTag.x - size * 2/3, winningTag.y + winningTag.size*2);

        ctx.restore();
    }
};


Cloud.prototype.searchColor = function (ctx, sizeVar, showBubbles, 
         cHigh, cLow, mHigh, mLow, yHigh, yLow) {

    for (var i=0; i < squareCt*squareCt; i++) {
        pixelSquares[i] = false;
    }
    for (var n = 0; n < this.tags.length; n++) {
        var tag = this.tags[n];
        if (tag.inColorRange(cHigh, cLow, mHigh, mLow, yHigh, yLow)) {
            tag.drawBubbles(ctx, "colors", "colors", sizeVar, showBubbles, this.pixelSquares);
        }
        else {
            tag.x = -101;
            tag.y = -101;
            tag.draw = false;
        }
    }    
    for (var n = 0; n < this.tags.length; n++) {
        var tag = this.tags[n];
        if (tag.draw) {
            tag.drawText(ctx, showBubbles);
        }
    }    
};