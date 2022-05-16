import { toJson } from 'xml2json';

export function xmlToJson(xml: string): any {
  return JSON.parse(toJson(xml));
}
