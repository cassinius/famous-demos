var Engine = famous.core.Engine;
var Surface = famous.core.Surface;
var ImageSurface = famous.surfaces.ImageSurface;
var Modifier = famous.core.Modifier;
var StateModifier = famous.modifiers.StateModifier;
var Transform = famous.core.Transform;

  //=====================================================================
  // CONSTRUCTOR FUNCTION
  function ContactView() {
    View.apply(this, arguments);

    _createPicture.call(this);
  }

  ContactView.prototype = Object.create(View.prototype);
  ContactView.prototype.constructor = ContactView;

  ContactView.DEFAULT_OPTIONS = {};


  //=====================================================================
  function _createPicture() {
    var picture = new ImageSurface({
      size : [150, 150],
      properties : {
        borderRadius: '125px',
        pointerEvents : 'none',
        zIndex: 10
      }
    });
    circle.setContent("https://graph.facebook.com/bernd.malle/picture?type=large");

    var pictureModifier = new StateModifier({
      origin: [0.5, 0],
      align: [0.5, 0],
      transform: Transform.above
    });

    this.add(pictureModifier).add(picture);
  }

