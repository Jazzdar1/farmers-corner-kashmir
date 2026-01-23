const startCamera = async () => {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Camera not supported");
    }

    stopCamera();

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });

    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  } catch (err) {
    console.error("Camera error:", err);
    setError("Camera unavailable. Switching to upload mode.");
    setMode("upload");
  }
};
