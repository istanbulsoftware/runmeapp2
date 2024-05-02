const createHTMLMapMarker = ({ OverlayView = google.maps.OverlayView,  ...args }) => {
  class HTMLMapMarker extends OverlayView {
    constructor() {
      super();
      this.latlng = args.latlng;
      this.html = args.html;
      this.setMap(args.map);
    }
  
    createDiv() {
      this.div = document.createElement('div');
      this.div.style.position = 'absolute';
      this.div.style.cursor = 'pointer';
      this.div.style.width = '55px';
      this.div.style.height = '55px';

      if (this.html) {
        this.div.innerHTML = this.html;
      }
      
      google.maps.event.addDomListener(this.div, 'click', event => {
        google.maps.event.trigger(this, 'click');
      });
    }
  
    appendDivToOverlay() {
      const panes = this.getPanes();
      panes.overlayLayer.appendChild(this.div);
      panes.overlayMouseTarget.appendChild(this.div);
    }
  
    positionDiv() {
      const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
      if (point) {
        this.div.id = args.id;
        this.div.style.left = `${point.x}px`;
        this.div.style.top = `${point.y}px`;
        this.div.style.cursor = 'pointer';

      }
    }
  
    draw() {
      if (!this.div) {
        this.createDiv();
        this.appendDivToOverlay();
      }
      this.positionDiv();
    }
  
    remove() {
      if (this.div) {

        this.div.parentNode.removeChild(this.div);
        delete this.div;
      }
    }
  
    getPosition() {
      return this.latlng;
    }
  
    getDraggable() {
      return false;
    }

    setPosition(newLatLng){
      const point = this.getProjection().fromLatLngToDivPixel(newLatLng);
      if (point) {
        this.div.style.left = `${point.x}px`;
        this.div.style.top = `${point.y}px`;
        this.div.style.cursor = 'pointer';
      }
      this.appendDivToOverlay();
    }
  }
  

  return new HTMLMapMarker();
};

export default createHTMLMapMarker;