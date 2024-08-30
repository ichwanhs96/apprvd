import {IndentSpacingConv, LineSpacingConv, AlignmentConv,
    BorderConv, ShdConv} from './converters';

let convertors = [IndentSpacingConv, LineSpacingConv, AlignmentConv,
    BorderConv, ShdConv]
class FormatConv {
    styleId: any;
    name: string;
    conv: any;
    baseId: any;
    numbering: any;

    constructor(format: any, style: any) {
        this.styleId = style.style_id;
        this.name = style.name;
        if (style.base_style)
            this.baseId = style.base_style.style_id;
        this.conv = FormatConv.fromFormat(format);
    }
    static toFormat(format: any, conv: any){
        for(let convertor of convertors){
            convertor.to(format, conv);
        }
    }
    static fromFormat(format: any){
        let conv = {};
        for(let convertor of convertors){
            convertor.from(format, conv);
        }
        return conv;
    }
    static toStyleObj(conv: any){
        let obj = {};
        for(let convertor of convertors){
            convertor.toStyleObj(conv, obj);
        }
        return obj;
    }
    merge(base: any){
        if(Object.keys(base.conv).length===0) return;
        this.conv = Object.assign({}, base.conv, this.conv);
    }
    get styleObj(){
        let styleObj = FormatConv.toStyleObj(this.conv);
        if(this.numbering){
            styleObj = Object.assign(styleObj, this.numbering.styleObj);
        }
        return styleObj
    }
}

export {FormatConv}
