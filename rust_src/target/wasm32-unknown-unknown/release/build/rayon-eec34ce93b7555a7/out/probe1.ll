; ModuleID = 'probe1.393350b560980114-cgu.0'
source_filename = "probe1.393350b560980114-cgu.0"
target datalayout = "e-m:e-p:32:32-p10:8:8-p20:8:8-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

%"core::iter::adapters::rev::Rev<core::iter::adapters::step_by::StepBy<core::ops::range::Range<i32>>>" = type { %"core::iter::adapters::step_by::StepBy<core::ops::range::Range<i32>>" }
%"core::iter::adapters::step_by::StepBy<core::ops::range::Range<i32>>" = type { %"core::ops::range::Range<i32>", i32, i8, [3 x i8] }
%"core::ops::range::Range<i32>" = type { i32, i32 }

@alloc_4aead6e2018a46d0df208d5729447de7 = private unnamed_addr constant <{ [27 x i8] }> <{ [27 x i8] c"assertion failed: step != 0" }>, align 1
@alloc_15015252ba0136cd3d953972a8b14da6 = private unnamed_addr constant <{ [89 x i8] }> <{ [89 x i8] c"/rustc/75c68cfd2b9870f2953b62d250bd7d0564a7b56d/library/core/src/iter/adapters/step_by.rs" }>, align 1
@alloc_8990d86048e5677881e5fe261d228588 = private unnamed_addr constant <{ ptr, [12 x i8] }> <{ ptr @alloc_15015252ba0136cd3d953972a8b14da6, [12 x i8] c"Y\00\00\00!\00\00\00\09\00\00\00" }>, align 4

; core::iter::traits::iterator::Iterator::rev
; Function Attrs: inlinehint nounwind
define hidden void @_ZN4core4iter6traits8iterator8Iterator3rev17heeacbfec98d2f058E(ptr sret(%"core::iter::adapters::rev::Rev<core::iter::adapters::step_by::StepBy<core::ops::range::Range<i32>>>") align 4 %_0, ptr align 4 %self) unnamed_addr #0 {
start:
  call void @llvm.memcpy.p0.p0.i32(ptr align 4 %_0, ptr align 4 %self, i32 16, i1 false)
  ret void
}

; core::iter::traits::iterator::Iterator::step_by
; Function Attrs: inlinehint nounwind
define hidden void @_ZN4core4iter6traits8iterator8Iterator7step_by17h83a59437642f23bbE(ptr sret(%"core::iter::adapters::step_by::StepBy<core::ops::range::Range<i32>>") align 4 %_0, i32 %self.0, i32 %self.1, i32 %step) unnamed_addr #0 {
start:
  %0 = icmp eq i32 %step, 0
  br i1 %0, label %bb2, label %bb1

bb2:                                              ; preds = %start
; call core::panicking::panic
  call void @_ZN4core9panicking5panic17h0aceaa97805c87f8E(ptr align 1 @alloc_4aead6e2018a46d0df208d5729447de7, i32 27, ptr align 4 @alloc_8990d86048e5677881e5fe261d228588) #4
  unreachable

bb1:                                              ; preds = %start
; call <T as core::iter::adapters::step_by::SpecRangeSetup<T>>::setup
  %1 = call { i32, i32 } @"_ZN76_$LT$T$u20$as$u20$core..iter..adapters..step_by..SpecRangeSetup$LT$T$GT$$GT$5setup17h2e043762549f1843E"(i32 %self.0, i32 %self.1, i32 %step) #5
  %iter.0 = extractvalue { i32, i32 } %1, 0
  %iter.1 = extractvalue { i32, i32 } %1, 1
  %_5 = sub i32 %step, 1
  store i32 %iter.0, ptr %_0, align 4
  %2 = getelementptr inbounds i8, ptr %_0, i32 4
  store i32 %iter.1, ptr %2, align 4
  %3 = getelementptr inbounds %"core::iter::adapters::step_by::StepBy<core::ops::range::Range<i32>>", ptr %_0, i32 0, i32 1
  store i32 %_5, ptr %3, align 4
  %4 = getelementptr inbounds %"core::iter::adapters::step_by::StepBy<core::ops::range::Range<i32>>", ptr %_0, i32 0, i32 2
  store i8 1, ptr %4, align 4
  ret void
}

; <T as core::iter::adapters::step_by::SpecRangeSetup<T>>::setup
; Function Attrs: inlinehint nounwind
define hidden { i32, i32 } @"_ZN76_$LT$T$u20$as$u20$core..iter..adapters..step_by..SpecRangeSetup$LT$T$GT$$GT$5setup17h2e043762549f1843E"(i32 %inner.0, i32 %inner.1, i32 %_step) unnamed_addr #0 {
start:
  %0 = insertvalue { i32, i32 } poison, i32 %inner.0, 0
  %1 = insertvalue { i32, i32 } %0, i32 %inner.1, 1
  ret { i32, i32 } %1
}

; probe1::probe
; Function Attrs: nounwind
define hidden void @_ZN6probe15probe17h7382f75215a120d7E() unnamed_addr #1 {
start:
  %_3 = alloca %"core::ops::range::Range<i32>", align 4
  %_2 = alloca %"core::iter::adapters::step_by::StepBy<core::ops::range::Range<i32>>", align 4
  %_1 = alloca %"core::iter::adapters::rev::Rev<core::iter::adapters::step_by::StepBy<core::ops::range::Range<i32>>>", align 4
  store i32 0, ptr %_3, align 4
  %0 = getelementptr inbounds i8, ptr %_3, i32 4
  store i32 10, ptr %0, align 4
  %1 = load i32, ptr %_3, align 4, !noundef !1
  %2 = getelementptr inbounds i8, ptr %_3, i32 4
  %3 = load i32, ptr %2, align 4, !noundef !1
; call core::iter::traits::iterator::Iterator::step_by
  call void @_ZN4core4iter6traits8iterator8Iterator7step_by17h83a59437642f23bbE(ptr sret(%"core::iter::adapters::step_by::StepBy<core::ops::range::Range<i32>>") align 4 %_2, i32 %1, i32 %3, i32 2) #5
; call core::iter::traits::iterator::Iterator::rev
  call void @_ZN4core4iter6traits8iterator8Iterator3rev17heeacbfec98d2f058E(ptr sret(%"core::iter::adapters::rev::Rev<core::iter::adapters::step_by::StepBy<core::ops::range::Range<i32>>>") align 4 %_1, ptr align 4 %_2) #5
  ret void
}

; Function Attrs: nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i32(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i32, i1 immarg) #2

; core::panicking::panic
; Function Attrs: cold noinline noreturn nounwind
declare dso_local void @_ZN4core9panicking5panic17h0aceaa97805c87f8E(ptr align 1, i32, ptr align 4) unnamed_addr #3

attributes #0 = { inlinehint nounwind "target-cpu"="generic" "target-features"="+atomics,+bulk-memory,+mutable-globals" }
attributes #1 = { nounwind "target-cpu"="generic" "target-features"="+atomics,+bulk-memory,+mutable-globals" }
attributes #2 = { nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #3 = { cold noinline noreturn nounwind "target-cpu"="generic" "target-features"="+atomics,+bulk-memory,+mutable-globals" }
attributes #4 = { noreturn nounwind }
attributes #5 = { nounwind }

!llvm.ident = !{!0}

!0 = !{!"rustc version 1.77.0-nightly (75c68cfd2 2024-01-07)"}
!1 = !{}
