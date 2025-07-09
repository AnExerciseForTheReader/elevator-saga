{
    init: function(elevators, floors) {
        const floorCount = 21;
        const upReq = [];
        const downReq = [];
        const queue = [];

        // PASS setup
        for (let i = 0; i < floorCount; i++){
            upReq.push(false);
            downReq.push(false);
        }

        function upPress(floorNum){
            upReq[floorNum] = true;
            queue.push(floorNum);
        }

        function downPress(floorNum){
            downReq[floorNum] = true;
            queue.push(floorNum);
        }
        
        floors.forEach(function(f) {
            f.on("up_button_pressed", function() {upPress(f.floorNum())})
            f.on("down_button_pressed", function() {downPress(f.floorNum())})
        })

 
        // PASS Algorithm
        function getHighestReq(){
            console.log(upReq);
            console.log(downReq);
            var highest = 0;
            for (let i = floorCount - 1; i >= 0; i--){
                if (downReq[i] || upReq[i]){
                    highest = i;
                    break;
                }
            }
            return highest;
        }

        function getLowestReq(){
            var lowest = floorCount - 1;
            for (let i = 0; i < floorCount; i++){
                if (downReq[i] || upReq[i]){
                    lowest = i;
                    break;
                }
            }
            return lowest;
        }

        function highestPressed(el){
            var highest = 0;
            el.getPressedFloors().forEach(function(floor){
                if (floor > highest){
                    highest = floor;
                }
            })
            return highest;
        }

        function lowestPressed(el){
            var lowest = floorCount - 1;
            el.getPressedFloors().forEach(function(floor){
                if (floor < lowest){
                    lowest = floor;
                }
            })
            return lowest;
        }

        function passFloor(el, floorNum, direction){
            if (direction == "up"){
                if (upReq[floorNum] && el.loadFactor() < 0.6){
                    el.goToFloor(floorNum, true);
                    upReq[floorNum] = false;
                } else if (el.getPressedFloors().includes(floorNum)) {
                    el.goToFloor(floorNum, true);
                } else if (highestPressed(el) <= floorNum && getHighestReq() <= floorNum){
                    el.goingUpIndicator(false);
                    el.goingDownIndicator(true);
                    el.goToFloor(0, true);
                }
            } else {
                if (downReq[floorNum] && el.loadFactor() < 0.6){
                    el.goToFloor(floorNum, true);
                    downReq[floorNum] = false;
                } else if (el.getPressedFloors().includes(floorNum)) {
                    el.goToFloor(floorNum, true);
                } /*else if (lowestPressed(el) >= floorNum && getLowestReq() >= floorNum){
                    el.goingUpIndicator(true);
                    el.goingDownIndicator(false);
                    el.goToFloor(floorCount - 1, true);
                }*/
            }

        }

        function atFloor(el, floorNum, direction){
            if (floorNum == floorCount - 1 || (highestPressed(el) <= floorNum && getHighestReq() <= floorNum)){
                el.goingUpIndicator(false);
                el.goingDownIndicator(true);
                el.goToFloor(0, true);
            }
            if (floorNum == 0){
                el.goingUpIndicator(true);
                el.goingDownIndicator(false);
                el.goToFloor(floorCount - 1, true);
            }

            if (el.goingUpIndicator()){
                upReq[floorNum] = false;
            } else if (el.goingDownIndicator()){
                downReq[floorNum] = false;
            }
        }

        // Queue Algorithm
        function nextPassenger(el){
            if (queue.length == 0){
                return;
            }

            el.goToFloor(queue[0]);
            if (queue[0] > el.currentFloor()){
                el.goingUpIndicator(true);
                el.goingDownIndicator(false);
            } else {
                el.goingUpIndicator(false);
                el.goingDownIndicator(true);
            }
            queue.splice(0,1);
        }

        // Ground Floor Regime
        function passFloorG(el, floorNum, direction){
            if (direction == "up"){
                if (el.getPressedFloors().includes(floorNum)){
                    el.goToFloor(floorNum, true);
                    upReq[floorNum] = false;
                } else if (el.getPressedFloors().length == 0){
                    el.goingUpIndicator(false);
                    el.goingDownIndicator(true);
                    el.goToFloor(0, true);
                }
            }
        }

        function atFloorG(el, floorNum){
            if (floorNum == 0){
                el.goingUpIndicator(true);
                el.goingDownIndicator(false); 
                el.goToFloor(floorCount - 1, true);
            } else if (el.getPressedFloors().length == 0){
                el.goingUpIndicator(false);
                el.goingDownIndicator(true);
                el.goToFloor(0, true);
            }

            if (el.goingUpIndicator()){
                upReq[floorNum] = false;
            } else if (el.goingDownIndicator()){
                downReq[floorNum] = false;
            }
        }

        // Down Only Regime
        function passFloorD(el, floorNum, direction){
            if (direction == "down"){
                if (el.getPressedFloors().includes(floorNum)){
                    el.goToFloor(floorNum, true);
                } else if (el.getPressedFloors().length == 0){
                    el.goingUpIndicator(false);
                    el.goingDownIndicator(true);
                    el.goToFloor(0, true);
                }
            }
        }

        function atFloorG(el, floorNum){
            if (floorNum == 0){
                el.goingUpIndicator(true);
                el.goingDownIndicator(false); 
                el.goToFloor(floorCount - 1, true);
            } else if (el.getPressedFloors().length == 0){
                el.goingUpIndicator(false);
                el.goingDownIndicator(true);
                el.goToFloor(0, true);
            }
        }
        
        elevators.forEach(function(el){
            el.on("passing_floor", function(floorNum, direction) {
                passFloor(el, floorNum, direction);  
            })
            
            el.on("stopped_at_floor", function(floorNum) {
                // Maybe decide where to go next?
                atFloor(el, floorNum);
            })
        })

        elevator2.goingUpIndicator(true);
        elevator2.goingDownIndicator(false);
        elevator3.goingUpIndicator(true);
        elevator3.goingDownIndicator(false);
        elevator2.goToFloor(floorCount - 1);
        elevator3.goToFloor(floorCount - 1);

    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}