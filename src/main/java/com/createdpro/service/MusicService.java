package com.createdpro.service;

import com.createdpro.util.LyricExplain;
import com.createdpro.vo.JsonResult;
import com.createdpro.vo.PathConf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.util.StringUtils;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MusicService {

    @Autowired
    private PathConf pathConf;

    private static Map<String, Map<Integer, String>> tempMap = new ConcurrentHashMap<>();

    /**
     *
     * @param name
     * @return
     */
    public byte[] getMusic(String name) {
        String MUSIC_PATH = pathConf.getConf().getMUSIC_PATH();
        File music = new File(MUSIC_PATH, name);
        if (!music.exists()) {
            return null;
        }
        byte[] buffer = null;
        try {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            FileInputStream input = new FileInputStream(music);
            byte[] b = new byte[1024];
            int length;
            while ((length = input.read(b)) != -1){
                output.write(b, 0, length);
            }
            buffer = output.toByteArray();
            output.close();
            input.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return buffer;
    }

    // 返回音乐列表
    // TODO （后续会添加图片列表，歌词列表）
    public JsonResult getList(){
        String MUSIC_PATH = pathConf.getConf().getMUSIC_PATH();
        File path = new File(MUSIC_PATH);
        List<String> fileList = new ArrayList<>();
        if (! path.exists()) {
            return JsonResult.error(1, new RuntimeException("歌曲目录不存在"));
        }
        // 查找
        File[] files = path.listFiles();
        for (File file : files) {
            fileList.add(file.getName());
        }
        return JsonResult.success(fileList);
    }

    /**
     * 返回歌词
     * @param name
     * @return
     */
    public JsonResult getLyric(String name){
        if (StringUtils.isEmpty(name)){
            return JsonResult.error(1, new RuntimeException("参数不正确"));
        }
        String LYRIC_PATH = pathConf.getConf().getLYRIC_PATH();
        String realName = name.substring(0, name.lastIndexOf(".")) + ".lrc";
        if (tempMap.get(realName) != null){
            return JsonResult.success(tempMap.get(realName));
        }
        Map<Integer, String> lyric;
        try {
            lyric = LyricExplain.getLyric(realName, LYRIC_PATH);
        } catch (IOException e) {
            e.printStackTrace();
            return JsonResult.success(null);
        }
        if (lyric != null) tempMap.put(realName, lyric);
        return JsonResult.success(lyric);
    }

}
