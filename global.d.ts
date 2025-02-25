declare namespace kakao {
  export namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
    }
    class Map {
      constructor(container: HTMLElement, options: { center: LatLng; level: number });
      setCenter(latlng: LatLng): void;
    }
    namespace services {
      class Places {
        keywordSearch(query: string, callback: (result: any, status: any) => void): void;
      }
      enum Status {
        OK = "OK",
        ZERO_RESULT = "ZERO_RESULT",
        ERROR = "ERROR",
      }
      interface Place {
        place_name: string;
        address_name: string;
        road_address_name: string;
        x: string;
        y: string;
      }
    }
    class Marker {
      constructor(options: { position: LatLng; map: Map });
    }
  }
}
