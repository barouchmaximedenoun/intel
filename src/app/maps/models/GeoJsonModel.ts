export default class GeoJsonModel {
  type = 'FeatureCollection';
  features = [];
  constructor(feature) {
    this.features = [feature];
  }

  getId(): string {
    return this.features[0].id;
  }

  getName(): string {
    return this.features[0].properties.annotation;
  }
}
