"""
PRISM – Sorting Algorithm Trace Engine
Pure Python implementation generating execution steps for sorting algorithms.
"""
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from models.base import SimulationResult


class SortingRequest(BaseModel):
    algorithm: str = Field("bubble", description="bubble, quick, merge, insertion")
    initial_array: List[int] = Field(default_factory=lambda: [45, 20, 75, 10, 90, 30, 60, 85])


def compute_sorting(req: SortingRequest) -> SimulationResult:
    arr = list(req.initial_array)
    steps = []

    def record_step(current_arr, comparing, swapped, highlight=None):
        steps.append({
            "array": list(current_arr),
            "comparing": comparing,
            "swapped": swapped,
            "highlight": highlight or [],
        })

    alg = req.algorithm.lower()
    if alg == "bubble":
        a = list(arr)
        n = len(a)
        record_step(a, [], False)
        for i in range(n):
            for j in range(0, n - i - 1):
                record_step(a, [j, j + 1], False)
                if a[j] > a[j + 1]:
                    a[j], a[j + 1] = a[j + 1], a[j]
                    record_step(a, [j, j + 1], True)
    elif alg == "insertion":
        a = list(arr)
        record_step(a, [], False)
        for i in range(1, len(a)):
            key = a[i]
            j = i - 1
            while j >= 0 and a[j] > key:
                record_step(a, [j, j + 1], False)
                a[j + 1] = a[j]
                record_step(a, [j, j + 1], True)
                j -= 1
            a[j + 1] = key
            record_step(a, [j + 1], False)
    else:  # default bubble
        a = list(arr)
        n = len(a)
        record_step(a, [], False)
        for i in range(n):
            for j in range(0, n - i - 1):
                if a[j] > a[j + 1]:
                    a[j], a[j + 1] = a[j + 1], a[j]
                    record_step(a, [j, j + 1], True)

    return SimulationResult(
        simulator_id="sorting-algorithms",
        success=True,
        data={
            "algorithm": req.algorithm,
            "steps_count": len(steps),
            "steps": steps,
            "final_array": sorted(arr),
        },
        metadata={"engine": "python_algorithm_tracer"}
    )
