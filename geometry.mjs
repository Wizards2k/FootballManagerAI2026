// World coordinates and all physical dimensions are in metres.
// Pitch: FIFA stadium guidelines; markings/ball: IFAB Laws 1 and 2.
export const PITCH = Object.freeze({
  length:105, width:68, marginX:4, marginY:5,
  lineWidth:.12, goalWidth:7.32, goalDepth:2.2,
  penaltyDepth:16.5, goalAreaDepth:5.5, penaltySpot:11,
  centreRadius:9.15, cornerRadius:1,
});
// A conventional top-down body footprint, not the player's standing height
// and not an IFAB measurement. Labels and selection rings are UI overlays.
export const PLAYER = Object.freeze({diameter:.65, radius:.325});
export const BALL = Object.freeze({circumference:.69, radius:.69/(2*Math.PI)});
export function pitchViewport(width,height){
  const scale=Math.min(width/(PITCH.length+2*PITCH.marginX),height/(PITCH.width+2*PITCH.marginY));
  return {s:scale,ox:(width-PITCH.length*scale)/2,oy:(height-PITCH.width*scale)/2};
}
