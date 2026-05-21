import { router } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type DriverRideRequest = {
  id: string;
  riderName: string;
  rideType: "Premium ride" | "Regular ride" | "Multi-stop ride";
  pickup: string;
  destination: string;
  fare: string;
  scheduledLabel: string;
  rating: number;
  marker: {
    latitude: number;
    longitude: number;
  };
  pickupPreview: {
    region: {
      latitude: number;
      longitude: number;
      latitudeDelta: number;
      longitudeDelta: number;
    };
    routeCoordinates: {
      latitude: number;
      longitude: number;
    }[];
    passengerLocation: {
      latitude: number;
      longitude: number;
    };
  };
};

type DriverMockStateValue = {
  isOnline: boolean;
  requests: DriverRideRequest[];
  activeRide: DriverRideRequest | null;
  highlightedRequest: DriverRideRequest | null;
  showRequestBanner: boolean;
  showIncomingCard: boolean;
  filter: "All ride" | "Regular ride" | "Multi-stop ride";
  filterMenuOpen: boolean;
  visibleRequests: DriverRideRequest[];
  goOnline: () => void;
  goOffline: () => void;
  acceptRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;
  openAllRequests: () => void;
  closeIncomingCard: () => void;
  setFilter: (filter: "All ride" | "Regular ride" | "Multi-stop ride") => void;
  setFilterMenuOpen: (open: boolean) => void;
};

const FIRST_REQUEST_DELAY_MS = 60_000;
const MULTI_REQUEST_DELAY_MS = 10_000;

const REQUESTS: DriverRideRequest[] = [
  {
    id: "rq-1",
    riderName: "Jane Anigbo",
    rideType: "Premium ride",
    pickup: "Luxury Drive, Victoria Island, Lagos, Nigeria",
    destination: "Serene Lane, Lekki Phase 1, Lagos, Nigeria",
    fare: "N6,000",
    scheduledLabel: "02:00PM, Today",
    rating: 4.5,
    marker: { latitude: 6.5166, longitude: 3.3748 },
    pickupPreview: {
      region: {
        latitude: 6.5149,
        longitude: 3.3762,
        latitudeDelta: 0.0138,
        longitudeDelta: 0.0128,
      },
      routeCoordinates: [
        { latitude: 6.5218, longitude: 3.3817 },
        { latitude: 6.5202, longitude: 3.3817 },
        { latitude: 6.5202, longitude: 3.3788 },
        { latitude: 6.5187, longitude: 3.3788 },
        { latitude: 6.5187, longitude: 3.3776 },
        { latitude: 6.5169, longitude: 3.3776 },
        { latitude: 6.5169, longitude: 3.3748 },
        { latitude: 6.5166, longitude: 3.3748 },
      ],
      passengerLocation: { latitude: 6.5166, longitude: 3.3748 },
    },
  },
  {
    id: "rq-2",
    riderName: "Tobi Ekanem",
    rideType: "Regular ride",
    pickup: "Akin Adesola Street, Victoria Island, Lagos, Nigeria",
    destination: "Freedom Way, Lekki Phase 1, Lagos, Nigeria",
    fare: "N4,800",
    scheduledLabel: "02:06PM, Today",
    rating: 4.7,
    marker: { latitude: 6.5307, longitude: 3.3926 },
    pickupPreview: {
      region: {
        latitude: 6.5264,
        longitude: 3.3883,
        latitudeDelta: 0.0138,
        longitudeDelta: 0.0128,
      },
      routeCoordinates: [
        { latitude: 6.5218, longitude: 3.3817 },
        { latitude: 6.5235, longitude: 3.3817 },
        { latitude: 6.5235, longitude: 3.3864 },
        { latitude: 6.5271, longitude: 3.3864 },
        { latitude: 6.5271, longitude: 3.3926 },
        { latitude: 6.5307, longitude: 3.3926 },
      ],
      passengerLocation: { latitude: 6.5307, longitude: 3.3926 },
    },
  },
  {
    id: "rq-3",
    riderName: "Amaka Obi",
    rideType: "Multi-stop ride",
    pickup: "Admiralty Way, Lekki, Lagos, Nigeria",
    destination: "Chevron Drive, Lekki, Lagos, Nigeria",
    fare: "N7,300",
    scheduledLabel: "02:09PM, Today",
    rating: 4.8,
    marker: { latitude: 6.5014, longitude: 3.3913 },
    pickupPreview: {
      region: {
        latitude: 6.5078,
        longitude: 3.3854,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0132,
      },
      routeCoordinates: [
        { latitude: 6.5218, longitude: 3.3817 },
        { latitude: 6.5164, longitude: 3.3817 },
        { latitude: 6.5164, longitude: 3.3861 },
        { latitude: 6.5071, longitude: 3.3861 },
        { latitude: 6.5071, longitude: 3.3913 },
        { latitude: 6.5014, longitude: 3.3913 },
      ],
      passengerLocation: { latitude: 6.5014, longitude: 3.3913 },
    },
  },
];

const DriverMockStateContext = createContext<DriverMockStateValue | null>(null);

export function DriverMockStateProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(false);
  const [requests, setRequests] = useState<DriverRideRequest[]>([]);
  const [activeRide, setActiveRide] = useState<DriverRideRequest | null>(null);
  const [showIncomingCard, setShowIncomingCard] = useState(false);
  const [showRequestBanner, setShowRequestBanner] = useState(false);
  const [filter, setFilter] = useState<"All ride" | "Regular ride" | "Multi-stop ride">("All ride");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const firstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const batchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (firstTimerRef.current) {
      clearTimeout(firstTimerRef.current);
      firstTimerRef.current = null;
    }
    if (batchTimerRef.current) {
      clearTimeout(batchTimerRef.current);
      batchTimerRef.current = null;
    }
  }, []);

  const resetRequestFlow = useCallback(() => {
    clearTimers();
    setRequests([]);
    setActiveRide(null);
    setShowIncomingCard(false);
    setShowRequestBanner(false);
    setFilter("All ride");
    setFilterMenuOpen(false);
  }, [clearTimers]);

  const goOnline = useCallback(() => {
    if (isOnline) return;

    setIsOnline(true);
    resetRequestFlow();
    router.replace("/(driver)/home-online");

    firstTimerRef.current = setTimeout(() => {
      setRequests([REQUESTS[0]]);
      setShowIncomingCard(true);
      setShowRequestBanner(false);

      batchTimerRef.current = setTimeout(() => {
        setRequests(REQUESTS);
        setShowIncomingCard(false);
        setShowRequestBanner(true);
      }, MULTI_REQUEST_DELAY_MS);
    }, FIRST_REQUEST_DELAY_MS);
  }, [isOnline, resetRequestFlow]);

  const goOffline = useCallback(() => {
    setIsOnline(false);
    resetRequestFlow();
    router.replace("/(driver)/home");
  }, [resetRequestFlow]);

  const acceptRequest = useCallback((requestId: string) => {
    setRequests((current) => {
      const acceptedRide = current.find((request) => request.id === requestId) ?? null;
      const next = current.filter((request) => request.id !== requestId);
      setActiveRide(acceptedRide);
      if (next.length === 0) {
        setShowIncomingCard(false);
        setShowRequestBanner(false);
      } else {
        setShowIncomingCard(next.length === 1);
        setShowRequestBanner(next.length > 1);
      }
      return next;
    });
    router.replace("/(driver)/pickup");
  }, []);

  const declineRequest = useCallback((requestId: string) => {
    acceptRequest(requestId);
  }, [acceptRequest]);

  const closeIncomingCard = useCallback(() => {
    setShowIncomingCard(false);
  }, []);

  const openAllRequests = useCallback(() => {
    setShowIncomingCard(false);
    setShowRequestBanner(requests.length > 1);
    router.push("/(driver)/ride-requests");
  }, [requests.length]);

  const highlightedRequest = requests[0] ?? null;

  const visibleRequests = useMemo(() => {
    if (filter === "All ride") return requests;
    return requests.filter((request) => request.rideType === filter);
  }, [filter, requests]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const value = useMemo<DriverMockStateValue>(
    () => ({
      isOnline,
      requests,
      activeRide,
      highlightedRequest,
      showRequestBanner,
      showIncomingCard,
      filter,
      filterMenuOpen,
      visibleRequests,
      goOnline,
      goOffline,
      acceptRequest,
      declineRequest,
      openAllRequests,
      closeIncomingCard,
      setFilter,
      setFilterMenuOpen,
    }),
    [
      acceptRequest,
      activeRide,
      closeIncomingCard,
      declineRequest,
      filter,
      filterMenuOpen,
      goOffline,
      goOnline,
      highlightedRequest,
      isOnline,
      openAllRequests,
      requests,
      showIncomingCard,
      showRequestBanner,
      visibleRequests,
    ]
  );

  return <DriverMockStateContext.Provider value={value}>{children}</DriverMockStateContext.Provider>;
}

export function useDriverMockState() {
  const context = useContext(DriverMockStateContext);
  if (!context) {
    throw new Error("useDriverMockState must be used within DriverMockStateProvider");
  }
  return context;
}
