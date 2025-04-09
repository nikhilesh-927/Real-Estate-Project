"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"; // Import Leaflet components

const LocationSearch = ({ selectedAddress, setCoordinates }) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapPosition, setMapPosition] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false); // Track if the map has been initialized

  const mapRef = useRef(null); // Reference to the MapContainer

  const fetchLocations = async (inputValue) => {
    if (!inputValue || inputValue.length < 3) {
      setOptions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/autocomplete.php`,
        {
          params: {
            key: process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY,
            q: inputValue,
            format: "json",
          },
        }
      );

      const formattedOptions = response.data.map((place) => ({
        value: place.place_id,
        label: place.display_name,
        lat: place.lat,
        lon: place.lon,
      }));

      setOptions(formattedOptions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error.response?.data || error.message);
    }
  };

  const debouncedFetchLocations = useCallback(debounce(fetchLocations, 300), []);

  // Map Click Handler to update the position when the user clicks on the map
  const MapClickHandler = () => {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setMapPosition({ lat, lng }); // Update map position
        setCoordinates({ latitude: lat, longitude: lng }); // Update coordinates in parent
        setSelectedLocation(null); // Clear selected location from search (optional)
      },
    });
    return null;
  };

  useEffect(() => {
    if (selectedLocation) {
      // If a location is selected from the search dropdown, update map position
      setMapPosition({
        lat: selectedLocation.lat,
        lng: selectedLocation.lon,
      });
      setCoordinates({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lon,
      });
    }
  }, [selectedLocation, setCoordinates]);

  const mapPositionIsValid = mapPosition && mapPosition.lat && mapPosition.lng;

  // Only render the map if it hasn't been initialized yet
  const handleMapInitialization = () => {
    if (!mapInitialized && mapPositionIsValid) {
      setMapInitialized(true); // Mark the map as initialized
    }
  };

  useEffect(() => {
    handleMapInitialization(); // Check for map initialization when mapPositionIsValid
  }, [mapPositionIsValid, mapInitialized]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center w-full max-w-[90vw] md:max-w-lg">
        <MapPin className="h-10 w-10 p-2 bg-purple-200 rounded-l-lg text-primary" />
        <Select
          value={selectedLocation}
          onInputChange={(input, action) => {
            if (action.action !== "input-blur" && action.action !== "menu-close") {
              setQuery(input);
              debouncedFetchLocations(input);
            }
          }}
          onChange={(selectedOption) => {
            setSelectedLocation(selectedOption);
            selectedAddress(selectedOption);
            setQuery(selectedOption ? selectedOption.label : "");

            if (selectedOption) {
              setCoordinates({
                latitude: selectedOption.lat,
                longitude: selectedOption.lon,
              });
            }
          }}
          options={options}
          placeholder="Search for a location"
          isClearable
          isSearchable
          noOptionsMessage={() => "No locations found"}
          className="w-full"
          styles={{
            control: (provided) => ({
              ...provided,
              width: "100%",
              minWidth: "250px", // Ensures it works on small screens
              maxWidth: "90vw", // Prevents it from being too large
              fontSize: "16px", // Readable font size
            }),
          }}
        />
      </div>

    </div>
  );
};

export default LocationSearch;
