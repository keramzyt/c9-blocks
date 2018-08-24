/**
 * Block dependencies
 */
import classnames from 'classnames';
import Inspector from './components/inspector';
import './styles/style.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Dashicon, Tooltip, Button, PanelBody, Toolbar, withNotices } = wp.components;
const { registerBlockType, createBlock } = wp.blocks;
const { InnerBlocks } = wp.editor;

const attributes = {
    radioControl: {
        type: 'string',
        default: 'container',
    },
    bgImgSize: {
        type: 'string',
        default: 'cover',
    },
    containerImgURL: {
        type: 'string',
    },
    colorPaletteControl: {
        type: 'string',
        default: undefined,
    },
};

registerBlockType( 'covertnine-blocks/column-containers', {
  // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
  title: __( 'Content Container', 'cortex-blocks' ),
  description: __( 'A responsive container for columns of content', 'cortex-blocks' ),
  icon: 'columns',
  category: 'layout',
  keywords: [
    __( 'column', 'cortex-blocks' ),
    __( 'container', 'cortex-blocks'),
    __( 'responsive', 'cortex-blocks' ),
  ],
  attributes,
  edit: props => {
    const { attributes: { containerImgURL, radioControl, bgImgSize, colorPaletteControl }, setAttributes, className } = props;
    // Creates a column container that can take other blocks
    return [
        <Inspector { ...{ setAttributes, ...props} } />,
        <div 
          className={ classnames('container', className) } 
          style={ cortexBackgroundStyles( containerImgURL, bgImgSize ) } 
          >
        <div className="container-overlay" style={ overlayStyles( colorPaletteControl )} >
        </div>
          <div className="row">
            <div className={radioControl}>
              <div className="col-xs-12">
                <InnerBlocks />
              </div>
            </div>
          </div>
        </div>
    ];
  },

  save: props => {
    const { attributes: { containerImgURL, radioControl, bgImgSize, colorPaletteControl}, setAttributes, className } = props;
    const containerWidth3 = radioControl;

    return (
        <div>
        <div className="container-overlay" style={ overlayStyles( colorPaletteControl )} >
        </div>
          <div className="row">
            <div 
              className={ classnames('container', className) } 
              style={ cortexBackgroundStyles( containerImgURL, bgImgSize ) } 
              >
              <div className="col-xs-12">
                <InnerBlocks.Content />
              </div>
            </div>
          </div>
        </div>
    );
  }, //end save
} ); //end registerBlockType

function cortexBackgroundStyles( url, size, color ) {
  return url ?
    { 
      backgroundImage: `url(${ url })`, 
      backgroundSize: `${size}`,
    } :
    undefined;
}

function overlayStyles( color ) {
  return color ?
  {
    backgroundColor: `${color}`,
    opacity: .5,
  } :
  undefined;
}
