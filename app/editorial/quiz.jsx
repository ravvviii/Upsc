import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { api } from "../../lib/api"; // ✅ central API
import { ScrollView } from "react-native-gesture-handler";

export default function QuizScreen() {
  const { editorialId, title } = useLocalSearchParams();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 3);
  const [nextEnabled, setNextEnabled] = useState(false); // 🆕 for "Next" button state

  const timerRef = useRef(null);

  // 🧠 Fetch MCQs
  useEffect(() => {
    const loadMCQs = async () => {
      try {
        const res = await api.editorialMCQs.get(editorialId);
        setQuestions(res.mcqs || []);
      } catch (err) {
        console.log("Error fetching MCQs:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMCQs();
  }, []);

  // ⏱ Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const [submitting, setSubmitting] = useState(false);

const handleSelect = (option) => {
  if (selected) return;
  setSelected(option);

  setQuestions((prev) => {
    const updated = [...prev];
    updated[current] = { ...updated[current], selected: option };
    return updated;
  });

  const correct = option === questions[current].correctAnswer;
  if (correct) setScore((prev) => prev + 1);

  setTimeout(() => setNextEnabled(true), 100);
};


  // ✅ Handle "Next" button
  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setNextEnabled(false);
    } else {
      handleSubmit();
    }
  };

const handleSubmit = async () => {
  clearTimeout(timerRef.current);
  setSubmitting(true);

  try {
    const answers = questions.map((q) => ({
      mcqId: q._id,
      selected: q.selected,
    }));

    await api.editorialMCQs.submit({
      editorialId,
      answers,
    });

    router.replace({
      pathname: "/editorial/result",
      params: {
        total: questions.length,
        score,
        title,
      },
    });
  } catch (err) {
    console.log("Error submitting quiz:", err);
    alert("Error submitting your test. Try again!");
  } finally {
    setSubmitting(false);
  }
};



  // 🕓 Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-gray-600 font-outfit-medium">
          Loading your quiz...
        </Text>
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg font-outfit-bold text-gray-700">
          No questions available.
        </Text>
      </View>
    );
  }

  const q = questions[current];

  return (
    <View className="flex-1">
        <ScrollView>


    <View className=" bg-gray-50 p-5">
      {/* Header */}
      <View className="flex-row justify-between mb-4 items-center">
        <Text className="text-lg font-outfit-bold text-indigo-600">
          ⏰ {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </Text>
        <Text className="text-lg font-outfit-bold text-gray-600">
          Q {current + 1}/{questions.length}
        </Text>
      </View>

      {/* Question */}
      <Text className="text-xl font-outfit-bold text-gray-900 mb-5">
        {q?.question}
      </Text>

      {/* Options */}
      {q?.options.map((opt, idx) => {
        const isCorrect = selected && opt === q.correctAnswer;
        const isWrong = selected && opt === selected && opt !== q.correctAnswer;

        return (
          <Animated.View
            key={idx}
            entering={FadeIn}
            exiting={FadeOut}
            className={`rounded-xl border p-4 mb-3 ${
              selected
                ? isCorrect
                  ? "bg-green-100 border-green-500"
                  : isWrong
                  ? "bg-red-100 border-red-500"
                  : "opacity-50 border-gray-300"
                : "border-gray-300 bg-white"
            }`}
          >
            <TouchableOpacity
              disabled={!!selected}
              onPress={() => handleSelect(opt)}
            >
              <Text className="text-base font-outfit-medium text-gray-800">
                {opt}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* 🆕 Next Button */}
      <View className="mt-6">
        <TouchableOpacity
          disabled={!nextEnabled}
          onPress={handleNext}
          className={`py-3 rounded-xl ${
            nextEnabled ? "bg-indigo-600" : "bg-gray-300"
          } active:bg-indigo-700 justify-center items-center flex-row`}
        >
          <Text className="text-center text-white font-outfit-bold text-base">
            {current + 1 === questions.length ? "Submit Test" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
      {submitting && (
  <View className="absolute inset-0 bg-black/30 justify-center items-center z-50">
    <View className="bg-white px-6 py-4 rounded-2xl shadow-lg items-center">
      <ActivityIndicator size="large" color="#2563EB" />
      <Text className="mt-3 text-gray-700 font-outfit-medium text-center">
        Submitting your test...
      </Text>
    </View>
  </View>
)}

    </View>
            </ScrollView>

    </View>
  );
}


